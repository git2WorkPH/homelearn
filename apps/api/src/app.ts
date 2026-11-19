import Fastify, { LogController } from "fastify";
import { InMemoryCurriculumRepository } from "./modules/curriculum/infrastructure/in-memory-curriculum-repository.js";
import { registerCurriculumRoutes } from "./modules/curriculum/presentation/curriculum-routes.js";
export function buildApp() {
  const app = Fastify({
    logger: {
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        'res.headers["set-cookie"]',
      ],
    },
    logController: new LogController({ disableRequestLogging: true }),
  });
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: { status: { type: "string", const: "ok" } },
          },
        },
      },
    },
    async () => ({ status: "ok" }),
  );
  const curriculumRepository = new InMemoryCurriculumRepository();
  void registerCurriculumRoutes(app, curriculumRepository);
  return app;
}
