import Fastify, { LogController } from 'fastify';
import { InMemoryCurriculumRepository } from './modules/curriculum/infrastructure/in-memory-curriculum-repository.js';
import { registerCurriculumRoutes } from './modules/curriculum/presentation/curriculum-routes.js';
import { InMemoryPlanningRepository } from './modules/planning/infrastructure/in-memory-planning-repository.js';
import { registerPlanningRoutes } from './modules/planning/presentation/planning-routes.js';
import { InMemoryLearningRecordRepository } from './modules/learning-records/infrastructure/in-memory-learning-record-repository.js';
import { registerLearningRecordRoutes } from './modules/learning-records/presentation/learning-record-routes.js';
export function buildApp() {
  const app = Fastify({ logger: { redact: ['req.headers.authorization','req.headers.cookie','res.headers["set-cookie"]'] }, logController: new LogController({ disableRequestLogging: true }) });
  app.get('/health', { schema: { response: { 200: { type: 'object', additionalProperties: false, required: ['status'], properties: { status: { type: 'string', const: 'ok' } } } } } }, async () => ({ status: 'ok' }));
  void registerCurriculumRoutes(app,new InMemoryCurriculumRepository());
  void registerPlanningRoutes(app,new InMemoryPlanningRepository());
  void registerLearningRecordRoutes(app,new InMemoryLearningRecordRepository());
  return app;
}
