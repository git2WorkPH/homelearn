import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { CATALOGUE_PACK_ID, CATALOGUE_PACK_TITLE, CATALOGUE_PACK_VERSION, isLearningAreaKey, isLearningLevelKey } from '../domain/catalogue.js';
import type { CatalogueRepository } from '../application/catalogue-repository.js';
import { STARTER_K3_LESSONS } from '../content/starter-k3-pack.js';

const filtersSchema = z.object({
  level: z.string().optional(),
  learningArea: z.string().optional(),
  q: z.string().trim().max(200).optional(),
}).strict();

export async function registerCatalogueRoutes(app: FastifyInstance, repository: CatalogueRepository): Promise<void> {
  app.get('/api/v1/catalogue/lessons', async (request, reply) => {
    const parsed = filtersSchema.safeParse(request.query);
    if (!parsed.success ||
      (parsed.data.level !== undefined && !isLearningLevelKey(parsed.data.level)) ||
      (parsed.data.learningArea !== undefined && !isLearningAreaKey(parsed.data.learningArea))) {
      return reply.code(400).send({ error: 'INVALID_REQUEST' });
    }
    const lessons = await repository.list({
      ...(parsed.data.level === undefined ? {} : { levelKey: parsed.data.level }),
      ...(parsed.data.learningArea === undefined ? {} : { learningAreaKey: parsed.data.learningArea }),
      ...(parsed.data.q === undefined ? {} : { search: parsed.data.q }),
    });
    return reply.header('cache-control', 'no-store').send({
      pack: { id: CATALOGUE_PACK_ID, version: CATALOGUE_PACK_VERSION, title: CATALOGUE_PACK_TITLE, totalLessons: STARTER_K3_LESSONS.length },
      total: lessons.length,
      items: lessons,
    });
  });

  app.get('/api/v1/catalogue/coverage', async (_request, reply) => {
    return reply.header('cache-control', 'no-store').send({
      pack: { id: CATALOGUE_PACK_ID, version: CATALOGUE_PACK_VERSION },
      cells: await repository.coverage(),
    });
  });

  app.get<{ Params: { reference: string } }>('/api/v1/catalogue/lessons/:reference', async (request, reply) => {
    const lesson = await repository.get(request.params.reference);
    if (lesson === undefined) return reply.code(404).send({ error: 'CATALOGUE_LESSON_NOT_FOUND' });
    return reply.header('cache-control', 'no-store').send(lesson);
  });
}
