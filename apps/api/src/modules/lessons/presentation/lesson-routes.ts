import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { LessonDraftProvider } from '../application/lesson-draft-provider.js';
import type { LessonRepository } from '../application/lesson-repository.js';
import { createLessonVersion, LessonError } from '../domain/lesson-version.js';

const lessonBodySchema = z.object({
  id: z.string().trim().min(1).max(300), lessonKey: z.string().trim().min(1).max(200),
  familyId: z.string().trim().min(1).max(200), versionLabel: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1).max(300), subject: z.string().trim().min(1).max(120),
  strand: z.string().trim().min(1).max(160), learningLevel: z.string().trim().min(1).max(80),
  learningGoal: z.string().trim().min(1).max(1000), successCriteria: z.array(z.string().trim().min(1).max(1000)).max(30),
  description: z.string().trim().min(1).max(5000).optional(), materials: z.array(z.string().trim().min(1).max(1000)).max(30),
  steps: z.array(z.string().trim().min(1).max(1000)).min(1).max(20), adaptation: z.string().trim().min(1).max(5000).optional(),
  estimatedMinutes: z.number().int().min(1).max(480).optional(),
  creationMethod: z.enum(['manual', 'ai-generated']).default('manual'), parentApproved: z.literal(true).optional(),
  aiProvider: z.string().trim().min(1).max(80).optional(), aiModel: z.string().trim().min(1).max(120).optional(),
}).strict().refine(input => input.creationMethod === 'ai-generated'
  ? input.parentApproved === true && input.aiProvider !== undefined && input.aiModel !== undefined
  : input.parentApproved === undefined && input.aiProvider === undefined && input.aiModel === undefined);

const draftRequestSchema = z.object({
  subject: z.string().trim().min(1).max(120), strand: z.string().trim().min(1).max(160),
  learningLevel: z.string().trim().min(1).max(80), topic: z.string().trim().min(1).max(300),
  teachingNotes: z.string().trim().max(1000).optional(),
}).strict();

export async function registerLessonRoutes(
  app: FastifyInstance,
  repository: LessonRepository,
  draftProvider?: LessonDraftProvider,
): Promise<void> {
  app.get('/api/v1/lesson-versions', async (request, reply) => {
    const query = z.object({ familyId: z.string().trim().min(1).max(200) }).strict().safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    return reply.header('cache-control', 'no-store').send(await repository.list(query.data.familyId));
  });

  app.get<{ Params: { lessonVersionId: string } }>('/api/v1/lesson-versions/:lessonVersionId', async (request, reply) => {
    const query = z.object({ familyId: z.string().trim().min(1).max(200) }).strict().safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const lesson = await repository.get(request.params.lessonVersionId);
    if (lesson === undefined || lesson.familyId !== query.data.familyId) return reply.code(404).send({ error: 'LESSON_VERSION_NOT_FOUND' });
    return reply.header('cache-control', 'no-store').send(lesson);
  });

  app.post('/api/v1/lesson-versions', async (request, reply) => {
    const parsed = lessonBodySchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    try {
      const input = parsed.data;
      if (input.creationMethod === 'ai-generated' && (draftProvider === undefined || input.aiProvider !== draftProvider.providerId || input.aiModel !== draftProvider.modelId)) return reply.code(400).send({ error: 'AI_PROVENANCE_MISMATCH' });
      const lesson = createLessonVersion({
        id: input.id, lessonKey: input.lessonKey, familyId: input.familyId, versionLabel: input.versionLabel,
        title: input.title, subject: input.subject, strand: input.strand, learningLevel: input.learningLevel,
        learningGoal: input.learningGoal, successCriteria: input.successCriteria, materials: input.materials,
        steps: input.steps, creationMethod: input.creationMethod,
        ...(input.description === undefined ? {} : { description: input.description }),
        ...(input.adaptation === undefined ? {} : { adaptation: input.adaptation }),
        ...(input.estimatedMinutes === undefined ? {} : { estimatedMinutes: input.estimatedMinutes }),
        ...(input.creationMethod === 'ai-generated' ? { parentApprovedAt: new Date().toISOString() } : {}),
        ...(input.aiProvider === undefined ? {} : { aiProvider: input.aiProvider }),
        ...(input.aiModel === undefined ? {} : { aiModel: input.aiModel }),
        createdAt: new Date().toISOString(),
      });
      const saved = await repository.create(lesson);
      return reply.code(201).header('location', `/api/v1/lesson-versions/${encodeURIComponent(saved.id)}`).send(saved);
    } catch (error) {
      if (error instanceof LessonError) return reply.code(400).send({ error: error.code });
      if (error instanceof Error && error.message === 'DUPLICATE_LESSON_VERSION') return reply.code(409).send({ error: 'LESSON_VERSION_ALREADY_EXISTS' });
      throw error;
    }
  });

  app.post('/api/v1/lesson-drafts', async (request, reply) => {
    const parsed = draftRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    if (draftProvider === undefined) return reply.code(503).send({ error: 'AI_UNAVAILABLE' });
    try {
      const input = parsed.data;
      const draft = await draftProvider.generate({
        subject: input.subject, strand: input.strand, learningLevel: input.learningLevel, topic: input.topic,
        ...(input.teachingNotes === undefined ? {} : { teachingNotes: input.teachingNotes }),
      });
      return reply.header('cache-control', 'no-store').send({ ...draft, creationMethod: 'ai-generated', aiProvider: draftProvider.providerId, aiModel: draftProvider.modelId, requiresParentReview: true });
    } catch (error) {
      if (error instanceof LessonError) return reply.code(error.code === 'AI_INVALID_OUTPUT' ? 502 : 503).send({ error: error.code });
      return reply.code(503).send({ error: 'AI_UNAVAILABLE' });
    }
  });
}
