import "./lib/load-environment.js";
import { z } from "zod";
import { isIP } from "node:net";
import { buildApp } from "./app.js";
import { createPrismaClient } from "./lib/prisma.js";
import { OllamaLessonDraftProvider } from "./modules/lessons/infrastructure/ollama-lesson-draft-provider.js";
import { createHomeLearnAuth } from "./modules/identity/auth.js";
const config = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    HOST: z.string().default("127.0.0.1").refine((host) =>
      host === "localhost" || host === "::1" || (isIP(host) === 4 && host.startsWith("127.")),
    "HOST must be loopback until secure LAN access is configured."),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().url().default("http://127.0.0.1:3000"),
    OLLAMA_MODEL: z.string().trim().min(1).default("llama3.2"),
  })
  .parse(process.env);
const prisma = createPrismaClient(config.DATABASE_URL);
const auth = createHomeLearnAuth({ prisma, secret: config.BETTER_AUTH_SECRET, baseURL: config.BETTER_AUTH_URL });
const app = buildApp({ prisma, auth, authBaseURL: config.BETTER_AUTH_URL, lessonDraftProvider: new OllamaLessonDraftProvider(config.OLLAMA_MODEL) });
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void app
      .close()
      .finally(() => prisma.$disconnect())
      .catch(() => {
        process.exitCode = 1;
      });
  });
}
try {
  await app.listen({ port: config.PORT, host: config.HOST });
} catch {
  app.log.error("API startup failed");
  process.exitCode = 1;
  await prisma.$disconnect();
}
