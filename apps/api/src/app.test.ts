import { expect, test } from 'vitest';
import { buildApp } from './app.js';
test('health is available without exposing internals; unknown routes fail', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    expect((await app.inject({ method: 'GET', url: '/learners' })).statusCode).toBe(404);
    expect((await app.inject({ method: 'POST', url: '/api/v1/lesson-drafts', payload: {
      subject: 'Science', strand: 'Inquiry', learningLevel: 'Year 2', topic: 'garden changes',
    } })).statusCode).toBe(503);
  } finally { await app.close(); }
});

test('creates family lesson versions and links them to planning and learning records', async () => {
  const app = buildApp({ lessonDraftProvider: {
    providerId: 'synthetic-provider', modelId: 'synthetic-model',
    async generate(input) {
      return {
        title: `${input.topic} lesson`, subject: input.subject, strand: input.strand,
        learningLevel: input.learningLevel, learningGoal: `Explore ${input.topic}`,
        successCriteria: ['Share one observation'], materials: ['Paper'],
        steps: ['Observe a family activity', 'Talk about what happened'], estimatedMinutes: 25,
      };
    },
  } });
  const familyId = 'synthetic-family-a';
  const lessonVersionId = 'synthetic-lesson-v1';
  try {
    const draft = await app.inject({ method: 'POST', url: '/api/v1/lesson-drafts', payload: {
      subject: 'Science', strand: 'Living things', learningLevel: 'Year 2', topic: 'garden insects',
    } });
    expect(draft.statusCode).toBe(200);
    expect(draft.json()).toMatchObject({ creationMethod: 'ai-generated', aiProvider: 'synthetic-provider', aiModel: 'synthetic-model', requiresParentReview: true, title: 'garden insects lesson' });

    const savedLesson = await app.inject({ method: 'POST', url: '/api/v1/lesson-versions', payload: {
      id: lessonVersionId, lessonKey: 'synthetic-lesson', familyId, versionLabel: '1.0',
      title: 'Pattern walk', subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2',
      learningGoal: 'Notice and describe a repeating pattern.', successCriteria: ['Describe the repeating part'],
      materials: ['Household objects'], steps: ['Find a pattern', 'Describe what repeats'],
      estimatedMinutes: 20, creationMethod: 'manual',
    } });
    expect(savedLesson.statusCode).toBe(201);
    expect(savedLesson.json()).toMatchObject({ id: lessonVersionId, creationMethod: 'manual', steps: ['Find a pattern', 'Describe what repeats'] });

    const approvedAiLesson = await app.inject({ method: 'POST', url: '/api/v1/lesson-versions', payload: {
      id: 'synthetic-ai-lesson-approved', lessonKey: 'synthetic-ai-lesson', familyId, versionLabel: '1.0',
      title: 'Garden insect observation', subject: 'Science', strand: 'Living things', learningLevel: 'Year 2',
      learningGoal: 'Observe an insect without disturbing it.', successCriteria: ['Describe one observation'],
      materials: ['Paper'], steps: ['Observe from a safe distance'], creationMethod: 'ai-generated',
      parentApproved: true, aiProvider: 'synthetic-provider', aiModel: 'synthetic-model',
    } });
    expect(approvedAiLesson.statusCode).toBe(201);
    expect(approvedAiLesson.json()).toMatchObject({ creationMethod: 'ai-generated', aiProvider: 'synthetic-provider', aiModel: 'synthetic-model' });
    expect(typeof approvedAiLesson.json().parentApprovedAt).toBe('string');
    const duplicateLesson = await app.inject({ method: 'POST', url: '/api/v1/lesson-versions', payload: {
      id: 'synthetic-lesson-v2-duplicate', lessonKey: 'synthetic-lesson', familyId, versionLabel: '1.0',
      title: 'Duplicate version', subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2',
      learningGoal: 'Describe a pattern.', successCriteria: [], materials: [], steps: ['Find a pattern'], creationMethod: 'manual',
    } });
    expect(duplicateLesson.statusCode).toBe(409);

    const plan = await app.inject({ method: 'POST', url: '/api/v1/plans', payload: {
      id: 'synthetic-plan-a', familyId, title: 'Synthetic week', startsOn: '2026-11-23', endsOn: '2026-11-29', status: 'active',
    } });
    expect(plan.statusCode).toBe(201);
    const activity = await app.inject({ method: 'POST', url: '/api/v1/activities', payload: {
      id: 'synthetic-activity-a', familyId, planId: 'synthetic-plan-a', title: 'Pattern walk',
      learnerIds: ['synthetic-learner-a'], lessonVersionId,
    } });
    expect(activity.statusCode).toBe(201);
    expect(activity.json()).toMatchObject({ lessonVersionId });

    const experience = await app.inject({ method: 'POST', url: '/api/v1/learning-experiences', payload: {
      id: 'synthetic-experience-a', familyId, happenedAt: '2026-11-24T03:00:00Z', title: 'Pattern walk together', activityId: 'synthetic-activity-a',
    } });
    expect(experience.statusCode).toBe(201);
    const record = await app.inject({ method: 'POST', url: '/api/v1/learner-records', payload: {
      id: 'synthetic-record-a', experienceId: 'synthetic-experience-a', learnerId: 'synthetic-learner-a',
      completed: false, lessonVersionId,
    } });
    expect(record.statusCode).toBe(201);
    expect(record.json()).toMatchObject({ lessonVersionId, completed: false });

    const unapprovedAiLesson = await app.inject({ method: 'POST', url: '/api/v1/lesson-versions', payload: {
      id: 'synthetic-ai-lesson', lessonKey: 'synthetic-ai-lesson', familyId, versionLabel: '1.0',
      title: 'AI draft', subject: 'Science', strand: 'Inquiry', learningLevel: 'Year 2', learningGoal: 'Observe safely.',
      successCriteria: [], materials: [], steps: ['Look closely'], creationMethod: 'ai-generated',
    } });
    expect(unapprovedAiLesson.statusCode).toBe(400);

    const otherFamilyPlan = await app.inject({ method: 'POST', url: '/api/v1/plans', payload: {
      id: 'synthetic-plan-b', familyId: 'synthetic-family-b', title: 'Other week', startsOn: '2026-11-23', endsOn: '2026-11-29', status: 'active',
    } });
    expect(otherFamilyPlan.statusCode).toBe(201);
    const crossFamilyActivity = await app.inject({ method: 'POST', url: '/api/v1/activities', payload: {
      id: 'synthetic-activity-b', familyId: 'synthetic-family-b', planId: 'synthetic-plan-b', title: 'Other activity',
      learnerIds: ['synthetic-learner-b'], lessonVersionId,
    } });
    expect(crossFamilyActivity.statusCode).toBe(404);
    const otherFamilyExperience = await app.inject({ method: 'POST', url: '/api/v1/learning-experiences', payload: {
      id: 'synthetic-experience-b', familyId: 'synthetic-family-b', happenedAt: '2026-11-25T03:00:00Z', title: 'Other family experience',
    } });
    expect(otherFamilyExperience.statusCode).toBe(201);
    const crossFamilyRecord = await app.inject({ method: 'POST', url: '/api/v1/learner-records', payload: {
      id: 'synthetic-record-b', experienceId: 'synthetic-experience-b', learnerId: 'synthetic-learner-b', completed: false, lessonVersionId,
    } });
    expect(crossFamilyRecord.statusCode).toBe(404);
  } finally {
    await app.close();
  }
});
