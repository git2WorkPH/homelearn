import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { assessOutcome, LearningRecordError, recordLearnerParticipation, recordLearningExperience, updateLearnerObservation } from '../domain/learning-record.js';
import type { LearningRecordRepository } from '../application/learning-record-repository.js';
import type { LessonRepository } from '../../lessons/index.js';
import type { CatalogueRepository } from '../../lesson-catalogue/index.js';
import { requireHomeLearnActor } from '../../identity/fastify-context.js';
import type { PlanningRepository } from '../../planning/application/planning-repository.js';
import type { CurriculumRepository } from '../../curriculum/application/curriculum-repository.js';

const experienceSchema = z.object({ id: z.string(), familyId: z.string(), happenedAt: z.string(), activityId: z.string().optional(), title: z.string() }).strict();
const learnerRecordSchema = z.object({ id: z.string(), experienceId: z.string(), learnerId: z.string(), observation: z.string().optional(), completed: z.boolean(), lessonVersionId: z.string().trim().min(1).max(300).optional(), catalogLessonRef: z.string().trim().min(1).max(300).optional(), curriculumVersionId: z.string().optional(), configurationSnapshot: z.record(z.string(), z.unknown()).optional() }).strict();
const assessmentSchema = z.object({ id: z.string(), learnerRecordId: z.string(), outcomeId: z.string(), assessedAt: z.string(), assessedBy: z.string(), judgement: z.enum(['emerging', 'developing', 'demonstrated', 'not-assessed']), rationale: z.string().optional() }).strict();

export async function registerLearningRecordRoutes(app: FastifyInstance, repository: LearningRecordRepository, lessons: LessonRepository, catalogue: CatalogueRepository, planning: PlanningRepository, curricula: CurriculumRepository): Promise<void> {
  app.get('/api/v1/learning-experiences', async (request, reply) => reply.header('cache-control', 'no-store').send(await repository.listExperiences(requireHomeLearnActor(request).familyId)));

  app.post('/api/v1/learning-experiences', async (request, reply) => {
    const parsed = experienceSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const actor = requireHomeLearnActor(request);
    if (parsed.data.familyId !== actor.familyId) return reply.code(404).send({ error: 'FAMILY_NOT_FOUND' });
    if (parsed.data.activityId !== undefined && await planning.getActivity(parsed.data.activityId, actor.familyId) === undefined) return reply.code(404).send({ error: 'ACTIVITY_NOT_FOUND' });
    try {
      const saved = await repository.createExperience(recordLearningExperience({ id: parsed.data.id, familyId: actor.familyId, happenedAt: parsed.data.happenedAt, title: parsed.data.title, ...(parsed.data.activityId === undefined ? {} : { activityId: parsed.data.activityId }) }));
      return reply.code(201).header('location', `/api/v1/learning-experiences/${encodeURIComponent(saved.id)}`).send(saved);
    } catch (error) {
      if (error instanceof LearningRecordError) return reply.code(400).send({ error: error.code });
      if (error instanceof Error && error.message === 'DUPLICATE_EXPERIENCE') return reply.code(409).send({ error: 'EXPERIENCE_ALREADY_EXISTS' });
      throw error;
    }
  });

  app.get('/api/v1/learner-records', async (request, reply) => {
    const query = z.object({ experienceId: z.string().optional() }).strict().safeParse(request.query);
    if (!query.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    return reply.header('cache-control', 'no-store').send(await repository.listLearnerRecords(requireHomeLearnActor(request).familyId, query.data.experienceId));
  });

  app.patch<{ Params: { recordId: string } }>('/api/v1/learner-records/:recordId', async (request, reply) => {
    const parsed = z.object({ observation: z.string().trim().min(1).nullable() }).strict().safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const actor = requireHomeLearnActor(request);
    const record = await repository.getLearnerRecord(request.params.recordId, actor.familyId);
    if (record === undefined) return reply.code(404).send({ error: 'LEARNER_RECORD_NOT_FOUND' });
    try {
      return reply.send(await repository.updateLearnerRecord(updateLearnerObservation(record, parsed.data.observation ?? undefined), actor.familyId));
    } catch (error) {
      if (error instanceof LearningRecordError) return reply.code(400).send({ error: error.code });
      throw error;
    }
  });

  app.get<{ Params: { recordId: string } }>('/api/v1/learner-records/:recordId/assessments', async (request, reply) => {
    const actor = requireHomeLearnActor(request);
    const record = await repository.getLearnerRecord(request.params.recordId, actor.familyId);
    if (record === undefined) return reply.code(404).send({ error: 'LEARNER_RECORD_NOT_FOUND' });
    return reply.header('cache-control', 'no-store').send(await repository.listAssessments(record.id, actor.familyId));
  });

  app.post('/api/v1/learner-records', async (request, reply) => {
    const parsed = learnerRecordSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const actor = requireHomeLearnActor(request);
    const experience = await repository.getExperience(parsed.data.experienceId, actor.familyId);
    if (experience === undefined) return reply.code(404).send({ error: 'EXPERIENCE_NOT_FOUND' });
    if (parsed.data.curriculumVersionId !== undefined && await curricula.get(parsed.data.curriculumVersionId, actor.familyId) === undefined) return reply.code(404).send({ error: 'CURRICULUM_VERSION_NOT_FOUND' });
    if (parsed.data.lessonVersionId !== undefined && await lessons.get(parsed.data.lessonVersionId, actor.familyId) === undefined) return reply.code(404).send({ error: 'LESSON_VERSION_NOT_FOUND' });
    if (parsed.data.catalogLessonRef !== undefined && await catalogue.get(parsed.data.catalogLessonRef) === undefined) return reply.code(404).send({ error: 'CATALOGUE_LESSON_NOT_FOUND' });
    try {
      const saved = await repository.createLearnerRecord(recordLearnerParticipation({ id: parsed.data.id, experienceId: parsed.data.experienceId, learnerId: parsed.data.learnerId, completed: parsed.data.completed, ...(parsed.data.observation === undefined ? {} : { observation: parsed.data.observation }), ...(parsed.data.lessonVersionId === undefined ? {} : { lessonVersionId: parsed.data.lessonVersionId }), ...(parsed.data.catalogLessonRef === undefined ? {} : { catalogLessonRef: parsed.data.catalogLessonRef }), ...(parsed.data.curriculumVersionId === undefined ? {} : { curriculumVersionId: parsed.data.curriculumVersionId }), ...(parsed.data.configurationSnapshot === undefined ? {} : { configurationSnapshot: parsed.data.configurationSnapshot }) }, experience));
      return reply.code(201).send(saved);
    } catch (error) {
      if (error instanceof LearningRecordError) return reply.code(400).send({ error: error.code });
      if (error instanceof Error && error.message === 'DUPLICATE_LEARNER_RECORD') return reply.code(409).send({ error: 'LEARNER_RECORD_ALREADY_EXISTS' });
      throw error;
    }
  });

  app.post<{ Params: { recordId: string } }>('/api/v1/learner-records/:recordId/assessments', async (request, reply) => {
    const parsed = assessmentSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const actor = requireHomeLearnActor(request);
    const record = await repository.getLearnerRecord(request.params.recordId, actor.familyId);
    if (record === undefined) return reply.code(404).send({ error: 'LEARNER_RECORD_NOT_FOUND' });
    const curriculum = record.curriculumVersionId === undefined ? undefined : await curricula.get(record.curriculumVersionId, actor.familyId);
    if (curriculum === undefined || !curriculum.outcomes.some(outcome => outcome.id === parsed.data.outcomeId)) return reply.code(404).send({ error: 'LEARNING_OUTCOME_NOT_FOUND' });
    try {
      const assessment = assessOutcome({ id: parsed.data.id, learnerRecordId: parsed.data.learnerRecordId, outcomeId: parsed.data.outcomeId, assessedAt: parsed.data.assessedAt, assessedBy: actor.userId, judgement: parsed.data.judgement, ...(parsed.data.rationale === undefined ? {} : { rationale: parsed.data.rationale }) }, record);
      return reply.code(201).send(await repository.createAssessment(assessment));
    } catch (error) {
      if (error instanceof LearningRecordError) return reply.code(400).send({ error: error.code });
      if (error instanceof Error && error.message === 'DUPLICATE_ASSESSMENT') return reply.code(409).send({ error: 'ASSESSMENT_ALREADY_EXISTS' });
      throw error;
    }
  });
}
