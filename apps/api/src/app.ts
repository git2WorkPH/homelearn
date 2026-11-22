import Fastify, { LogController } from "fastify";
import { InMemoryCurriculumRepository } from "./modules/curriculum/infrastructure/in-memory-curriculum-repository.js";
import { registerCurriculumRoutes } from "./modules/curriculum/presentation/curriculum-routes.js";
import { InMemoryPlanningRepository } from "./modules/planning/infrastructure/in-memory-planning-repository.js";
import { registerPlanningRoutes } from "./modules/planning/presentation/planning-routes.js";
import { InMemoryLearningRecordRepository } from "./modules/learning-records/infrastructure/in-memory-learning-record-repository.js";
import { registerLearningRecordRoutes } from "./modules/learning-records/presentation/learning-record-routes.js";
import { PrismaCurriculumRepository } from "./modules/curriculum/infrastructure/prisma-curriculum-repository.js";
import { PrismaPlanningRepository } from "./modules/planning/infrastructure/prisma-planning-repository.js";
import { PrismaLearningRecordRepository } from "./modules/learning-records/infrastructure/prisma-learning-record-repository.js";
import { InMemoryLessonRepository } from "./modules/lessons/infrastructure/in-memory-lesson-repository.js";
import { PrismaLessonRepository } from "./modules/lessons/infrastructure/prisma-lesson-repository.js";
import { registerLessonRoutes } from "./modules/lessons/presentation/lesson-routes.js";
import type { LessonDraftProvider } from "./modules/lessons/index.js";
import type { PrismaClient } from "./generated/prisma/client.js";
export function buildApp(
  dependencies: { readonly prisma?: PrismaClient; readonly lessonDraftProvider?: LessonDraftProvider } = {},
) {
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
  const lessonRepository = dependencies.prisma === undefined
    ? new InMemoryLessonRepository()
    : new PrismaLessonRepository(dependencies.prisma);
  void registerLessonRoutes(app, lessonRepository, dependencies.lessonDraftProvider);
  void registerCurriculumRoutes(
    app,
    dependencies.prisma === undefined
      ? new InMemoryCurriculumRepository()
      : new PrismaCurriculumRepository(dependencies.prisma),
  );
  void registerPlanningRoutes(
    app,
    dependencies.prisma === undefined
      ? new InMemoryPlanningRepository()
      : new PrismaPlanningRepository(dependencies.prisma),
    lessonRepository,
  );
  void registerLearningRecordRoutes(
    app,
    dependencies.prisma === undefined
      ? new InMemoryLearningRecordRepository()
      : new PrismaLearningRecordRepository(dependencies.prisma),
    lessonRepository,
  );
  return app;
}
