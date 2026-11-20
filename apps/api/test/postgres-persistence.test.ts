import { randomUUID } from 'node:crypto';
import { expect, test } from 'vitest';
import { createPrismaClient } from '../src/lib/prisma.js';
import { buildApp } from '../src/app.js';

const databaseUrl = process.env.DATABASE_URL;
const postgresTest = test.skipIf(databaseUrl === undefined);

postgresTest('persists planning, schedule history, observations, and assessments in PostgreSQL', async () => {
  if (databaseUrl === undefined) throw new Error('DATABASE_URL is required for this test.');

  const prisma = createPrismaClient(databaseUrl);
  const app = buildApp({ prisma });
  const suffix = randomUUID();
  const planId = `test-plan-${suffix}`;
  const familyId = `test-family-${suffix}`;
  const activityId = `test-activity-${suffix}`;
  const learnerId = `test-learner-${suffix}`;
  const experienceId = `test-experience-${suffix}`;
  const recordId = `test-record-${suffix}`;
  const assessmentId = `test-assessment-${suffix}`;

  try {
    const planResponse = await app.inject({ method: 'POST', url: '/api/v1/plans', payload: {
      id: planId, familyId, title: 'Synthetic PostgreSQL plan', startsOn: '2026-11-23', endsOn: '2026-11-29', status: 'active',
    } });
    expect(planResponse.statusCode).toBe(201);

    const activityResponse = await app.inject({ method: 'POST', url: '/api/v1/activities', payload: {
      id: activityId, familyId, planId, title: 'Synthetic PostgreSQL activity', learnerIds: [learnerId],
      schedule: { startsAt: '2026-11-24T01:00:00Z', endsAt: '2026-11-24T02:00:00Z', timeZone: 'Australia/Sydney' },
    } });
    expect(activityResponse.statusCode).toBe(201);

    const rescheduledResponse = await app.inject({ method: 'POST', url: `/api/v1/activities/${activityId}/reschedule`, payload: {
      changedAt: '2026-11-20T00:00:00Z', changedBy: 'test-adult',
    } });
    expect(rescheduledResponse.statusCode).toBe(200);

    const editedResponse = await app.inject({ method: 'PATCH', url: `/api/v1/activities/${activityId}`, payload: {
      title: 'Edited synthetic activity', learnerIds: [learnerId, `test-second-learner-${suffix}`],
    } });
    expect(editedResponse.statusCode).toBe(200);
    expect(editedResponse.json()).toMatchObject({
      title: 'Edited synthetic activity',
      learnerIds: [learnerId, `test-second-learner-${suffix}`],
      scheduleHistory: [{ previous: { timeZone: 'Australia/Sydney' } }],
    });

    const experienceResponse = await app.inject({ method: 'POST', url: '/api/v1/learning-experiences', payload: {
      id: experienceId, familyId, happenedAt: '2026-11-24T03:00:00Z', activityId, title: 'Synthetic learning experience',
    } });
    expect(experienceResponse.statusCode).toBe(201);
    const recordResponse = await app.inject({ method: 'POST', url: '/api/v1/learner-records', payload: {
      id: recordId, experienceId, learnerId, completed: false,
      curriculumVersionId: 'family-defined:synthetic-v1', configurationSnapshot: { sourceKind: 'family-defined' },
    } });
    expect(recordResponse.statusCode).toBe(201);

    const observationResponse = await app.inject({ method: 'PATCH', url: `/api/v1/learner-records/${recordId}`, payload: {
      observation: 'Synthetic observation for persistence verification',
    } });
    expect(observationResponse.statusCode).toBe(200);
    expect(observationResponse.json()).toMatchObject({ observation: 'Synthetic observation for persistence verification', completed: false });

    const assessmentResponse = await app.inject({ method: 'POST', url: `/api/v1/learner-records/${recordId}/assessments`, payload: {
      id: assessmentId, learnerRecordId: recordId, outcomeId: 'family-defined:synthetic-goal',
      assessedAt: '2026-11-24T04:00:00Z', assessedBy: 'test-adult', judgement: 'developing',
    } });
    expect(assessmentResponse.statusCode).toBe(201);
    const listedAssessments = await app.inject({ method: 'GET', url: `/api/v1/learner-records/${recordId}/assessments` });
    expect(listedAssessments.json()).toMatchObject([{ outcomeId: 'family-defined:synthetic-goal', judgement: 'developing' }]);
  } finally {
    await app.close();
    await prisma.outcomeAssessment.deleteMany({ where: { id: assessmentId } });
    await prisma.learnerLearningRecord.deleteMany({ where: { id: recordId } });
    await prisma.learningExperience.deleteMany({ where: { id: experienceId } });
    await prisma.activityScheduleRevision.deleteMany({ where: { activityId } });
    await prisma.activityAssignment.deleteMany({ where: { activityId } });
    await prisma.activity.deleteMany({ where: { id: activityId } });
    await prisma.learningPlan.deleteMany({ where: { id: planId } });
    await prisma.$disconnect();
  }
}, 30_000);
