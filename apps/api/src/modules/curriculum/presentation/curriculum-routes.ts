import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { CurriculumProvenance, LearningOutcome } from '../domain/curriculum.js';
import { CurriculumError, publishCurriculumVersion, type CurriculumVersion } from '../domain/curriculum.js';
import type { CurriculumRepository } from '../application/curriculum-repository.js';
const outcome = z.object({ id: z.string(), code: z.string(), title: z.string(), description: z.string().optional() }).strict();
type OutcomeInput = z.infer<typeof outcome>;
const provenanceSchema = z.object({ kind: z.enum(['official', 'family']), publisher: z.string(), sourceUrl: z.string().url().optional(), curriculumId: z.string(), versionLabel: z.string(), effectiveFrom: z.string(), effectiveTo: z.string().optional(), retrievedAt: z.string() }).strict();
type ProvenanceInput = z.infer<typeof provenanceSchema>;
const version = z.object({
  id: z.string(), curriculumId: z.string(), versionLabel: z.string(),
  provenance: provenanceSchema,
  outcomes: z.array(outcome),
}).strict();
function toResponse(value: CurriculumVersion) {
  return { id: value.id, curriculumId: value.curriculumId, versionLabel: value.versionLabel, provenance: value.provenance, outcomes: value.outcomes };
}
export async function registerCurriculumRoutes(app: FastifyInstance, repository: CurriculumRepository): Promise<void> {
  app.get('/api/v1/curricula', async (_request, reply) => reply.header('cache-control', 'no-store').send((await repository.list()).map(toResponse)));
  app.get<{ Params: { versionId: string } }>('/api/v1/curricula/:versionId', async (request, reply) => {
    const found = await repository.get(request.params.versionId);
    if (found === undefined) return reply.code(404).send({ error: 'NOT_FOUND' });
    return reply.header('cache-control', 'no-store').send(toResponse(found));
  });
  app.post('/api/v1/curricula', async (request, reply) => {
    const parsed = version.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    try {
      const input = parsed.data;
      const provenance: CurriculumProvenance = toProvenance(input.provenance);
      const outcomes: LearningOutcome[] = input.outcomes.map(toOutcome);
      const created = publishCurriculumVersion({ ...input, provenance, outcomes });
      const saved = await repository.create(created);
      return reply.code(201).header('location', `/api/v1/curricula/${encodeURIComponent(saved.id)}`).header('cache-control', 'no-store').send(toResponse(saved));
    } catch (error) {
      if (error instanceof CurriculumError) return reply.code(400).send({ error: error.code });
      if (error instanceof Error && error.message === 'DUPLICATE_VERSION') return reply.code(409).send({ error: 'VERSION_ALREADY_EXISTS' });
      throw error;
    }
  });
}

function toProvenance(input: ProvenanceInput): CurriculumProvenance {
  return { kind: input.kind, publisher: input.publisher, curriculumId: input.curriculumId, versionLabel: input.versionLabel, effectiveFrom: input.effectiveFrom, retrievedAt: input.retrievedAt, ...(input.sourceUrl === undefined ? {} : { sourceUrl: input.sourceUrl }), ...(input.effectiveTo === undefined ? {} : { effectiveTo: input.effectiveTo }) };
}
function toOutcome(input: OutcomeInput): LearningOutcome {
  return { id: input.id, code: input.code, title: input.title, ...(input.description === undefined ? {} : { description: input.description }) };
}
