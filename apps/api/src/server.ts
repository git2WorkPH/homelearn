import "./lib/load-environment.js";
import { z } from "zod";
import { isIP } from "node:net";
import { buildApp } from "./app.js";
import { createPrismaClient } from "./lib/prisma.js";
import { OllamaLessonDraftProvider } from "./modules/lessons/infrastructure/ollama-lesson-draft-provider.js";
const config = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    HOST: z.string().default("127.0.0.1").refine((host) =>
      host === "localhost" || host === "::1" || (isIP(host) === 4 && host.startsWith("127.")),
    "HOST must be loopback because the local API has no authentication."),
    DATABASE_URL: z.string().url(),
    OLLAMA_MODEL: z.string().trim().min(1).default("llama3.2"),
  })
  .parse(process.env);
const prisma = createPrismaClient(config.DATABASE_URL);
const app = buildApp({ prisma, lessonDraftProvider: new OllamaLessonDraftProvider(config.OLLAMA_MODEL) });
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
