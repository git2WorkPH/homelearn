import { expect, test } from 'vitest';
import { assessOutcome, LearningRecordError, recordLearnerParticipation, recordLearningExperience, updateLearnerObservation } from '../src/modules/learning-records/index.js';

const experience = () => recordLearningExperience({ id: 'experience-1', familyId: 'family-1', happenedAt: '2026-11-20T02:00:00Z', title: 'Spontaneous garden study' });

test('records unscheduled learning and learner participation separately', () => {
  const event = experience();
  const learnerA = recordLearnerParticipation({ id: 'record-a', experienceId: event.id, learnerId: 'learner-a', completed: true }, event);
  const learnerB = recordLearnerParticipation({ id: 'record-b', experienceId: event.id, learnerId: 'learner-b', completed: false, observation: 'Asked questions about leaves' }, event);
  expect(event.activityId).toBeUndefined();
  expect(learnerA.learnerId).not.toBe(learnerB.learnerId);
  expect(learnerB.observation).toContain('leaves');
});

test('completion alone does not imply an outcome assessment', () => {
  const event = experience();
  const record = recordLearnerParticipation({ id: 'record-a', experienceId: event.id, learnerId: 'learner-a', completed: true }, event);
  expect(() => assessOutcome({ id: 'assessment-1', learnerRecordId: record.id, outcomeId: 'outcome:v1:o1', assessedAt: '2026-11-20T03:00:00Z', assessedBy: 'parent-1', judgement: 'demonstrated' }, record)).toThrow('OUTCOME_VERSION_REQUIRED');
});

test('updates or clears an observation without changing completion state', () => {
  const event = experience();
  const record = recordLearnerParticipation({ id: 'record-a', experienceId: event.id, learnerId: 'learner-a', completed: true, observation: 'First note' }, event);
  const updated = updateLearnerObservation(record, 'Revised note');
  expect(updated.observation).toBe('Revised note');
  expect(updated.completed).toBe(true);
  expect(record.observation).toBe('First note');
  expect(updateLearnerObservation(updated, undefined).observation).toBeUndefined();
});

test('stores explicit assessment against versioned context and freezes snapshots', () => {
  const event = experience();
  const record = recordLearnerParticipation({ id: 'record-a', experienceId: event.id, learnerId: 'learner-a', completed: false, curriculumVersionId: 'curriculum:v1', configurationSnapshot: { pedagogy: ['family-defined'], deep: { enabled: true } } }, event);
  const assessment = assessOutcome({ id: 'assessment-1', learnerRecordId: record.id, outcomeId: 'outcome:v1:o1', assessedAt: '2026-11-20T03:00:00Z', assessedBy: 'parent-1', judgement: 'developing', rationale: 'Uses a prompt with support' }, record);
  expect(assessment.judgement).toBe('developing');
  expect(Object.isFrozen(record.configurationSnapshot)).toBe(true);
  expect(Object.isFrozen(record.configurationSnapshot?.deep)).toBe(true);
});

test('rejects mismatched events, incomplete snapshots and malformed assessments', () => {
  const event = experience();
  expect(() => recordLearnerParticipation({ id: 'record', experienceId: 'other', learnerId: 'learner', completed: false }, event)).toThrow(LearningRecordError);
  expect(() => recordLearnerParticipation({ id: 'record', experienceId: event.id, learnerId: 'learner', completed: false, curriculumVersionId: 'v1' }, event)).toThrow('INVALID_LEARNER_RECORD');
  const record = recordLearnerParticipation({ id: 'record', experienceId: event.id, learnerId: 'learner', completed: false, curriculumVersionId: 'v1', configurationSnapshot: {} }, event);
  expect(() => assessOutcome({ id: 'assessment', learnerRecordId: record.id, outcomeId: 'outcome', assessedAt: 'bad', assessedBy: 'parent', judgement: 'demonstrated' }, record)).toThrow('INVALID_ASSESSMENT');
});
