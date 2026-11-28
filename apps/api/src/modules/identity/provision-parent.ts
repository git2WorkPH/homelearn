import "../../lib/load-environment.js";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createPrismaClient } from "../../lib/prisma.js";
import { createHomeLearnAuth } from "./auth.js";

const databaseUrl = process.env.DATABASE_URL;
const secret = process.env.BETTER_AUTH_SECRET;
if (databaseUrl === undefined || secret === undefined)
  throw new Error(
    "Set DATABASE_URL and BETTER_AUTH_SECRET in the root .env file first.",
  );

const prisma = createPrismaClient(databaseUrl);
const auth = createHomeLearnAuth({
  prisma,
  secret,
  baseURL: process.env.BETTER_AUTH_URL ?? "http://127.0.0.1:3000",
  allowProvisioning: true,
});
const prompts = createInterface({ input: stdin, output: stdout });

function readHidden(prompt: string): Promise<string> {
  if (!stdin.isTTY)
    throw new Error(
      "Run this setup command in a terminal so the password can be entered without echo.",
    );
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const finish = () => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
    };
    const onData = (buffer: Buffer) => {
      const character = buffer.toString("utf8");
      if (character === "\u0003") {
        stdout.write("\n");
        finish();
        reject(new Error("Setup cancelled."));
      } else if (character === "\r" || character === "\n") {
        stdout.write("\n");
        finish();
        resolve(value);
      } else if (character === "\u007f" || character === "\b") {
        value = value.slice(0, -1);
      } else if (character >= " ") {
        value += character;
      }
    };
    stdin.on("data", onData);
  });
}

try {
  const email = (await prompts.question("Parent email: "))
    .trim()
    .toLocaleLowerCase("en-AU");
  const existingUser = await prisma.user.findUnique({ where: { email } });
  let userId = existingUser?.id;
  if (userId === undefined) {
    const name = (await prompts.question("Parent name: ")).trim();
    prompts.close();
    const password = await readHidden("Password (12+ characters): ");
    const confirmation = await readHidden("Confirm password: ");
    if (password !== confirmation) throw new Error("Passwords do not match.");
    const result = await auth.api.signUpEmail({
      body: { email, name, password },
    });
    userId = result.user.id;
  }

  const existingMemberships = await prisma.familyMember.count({
    where: { userId },
  });
  if (existingMemberships > 0)
    throw new Error("This parent account is already linked to a family.");
  await prisma.$transaction(async (transaction) => {
    await transaction.family.upsert({
      where: { id: "local-demo" },
      create: { id: "local-demo", name: "HomeLearn Family" },
      update: {},
    });
    await transaction.familyMember.create({
      data: { userId, familyId: "local-demo", role: "parent" },
    });
  });
  stdout.write("HomeLearn parent account is ready. Sign in from the app.\n");
} finally {
  prompts.close();
  await prisma.$disconnect();
}
