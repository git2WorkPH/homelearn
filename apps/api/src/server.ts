import { z } from "zod";
import { buildApp } from "./app.js";
import { createPrismaClient } from "./lib/prisma.js";
const config = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    HOST: z.string().default("127.0.0.1"),
    DATABASE_URL: z.string().url(),
  })
  .parse(process.env);
const prisma = createPrismaClient(config.DATABASE_URL);
const app = buildApp({ prisma });
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
