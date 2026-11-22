export interface LearningExperience {
  readonly id: string;
  readonly familyId: string;
  readonly happenedAt: string;
  readonly activityId?: string;
  readonly title: string;
}

export interface LearnerLearningRecord {
  readonly id: string;
  readonly experienceId: string;
  readonly learnerId: string;
  readonly observation?: string;
  readonly completed: boolean;
  /** Stable catalogue version reference, e.g. story-shapes@demo-0.2. */
  readonly lessonVersionId?: string;
  /** Stable shared catalogue reference, kept separate from a family-authored lesson. */
  readonly catalogLessonRef?: string;
  readonly curriculumVersionId?: string;
  readonly configurationSnapshot?: Readonly<Record<string, unknown>>;
}

export interface OutcomeAssessment {
  readonly id: string;
  readonly learnerRecordId: string;
  readonly outcomeId: string;
  readonly assessedAt: string;
  readonly assessedBy: string;
  readonly judgement: 'emerging' | 'developing' | 'demonstrated' | 'not-assessed';
  readonly rationale?: string;
}

export class LearningRecordError extends Error {
  constructor(readonly code: 'INVALID_EXPERIENCE' | 'INVALID_LEARNER_RECORD' | 'INVALID_ASSESSMENT' | 'OUTCOME_VERSION_REQUIRED') {
    super(`Learning record rejected: ${code}`);
    this.name = 'LearningRecordError';
  }
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0 && value === value.trim();
}

function instant(value: string): boolean {
  return Number.isFinite(Date.parse(value)) && value.endsWith('Z');
}

function freezeJson(value: unknown): unknown {
  if (Array.isArray(value)) return Object.freeze(value.map(freezeJson));
  if (typeof value === 'object' && value !== null) {
    return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, child]) => [key, freezeJson(child)])));
  }
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value;
  throw new LearningRecordError('INVALID_LEARNER_RECORD');
}

export function recordLearningExperience(input: LearningExperience): LearningExperience {
  if (![input.id, input.familyId, input.title].every(nonEmpty) || !instant(input.happenedAt) || (input.activityId !== undefined && !nonEmpty(input.activityId))) {
    throw new LearningRecordError('INVALID_EXPERIENCE');
  }
  return Object.freeze({ ...input });
}

export function recordLearnerParticipation(input: LearnerLearningRecord, experience: LearningExperience): LearnerLearningRecord {
  if (![input.id, input.experienceId, input.learnerId].every(nonEmpty) || input.experienceId !== experience.id || typeof input.completed !== 'boolean' || (input.observation !== undefined && !nonEmpty(input.observation)) || (input.lessonVersionId !== undefined && !nonEmpty(input.lessonVersionId)) || (input.catalogLessonRef !== undefined && !nonEmpty(input.catalogLessonRef)) || ((input.curriculumVersionId === undefined) !== (input.configurationSnapshot === undefined))) {
    throw new LearningRecordError('INVALID_LEARNER_RECORD');
  }
  if (input.configurationSnapshot === undefined) return Object.freeze({ ...input });
  const snapshot = freezeJson(input.configurationSnapshot);
  if (typeof snapshot !== 'object' || snapshot === null || Array.isArray(snapshot)) throw new LearningRecordError('INVALID_LEARNER_RECORD');
  return Object.freeze({ ...input, configurationSnapshot: snapshot as Readonly<Record<string, unknown>> });
}

/** Parent observations can be revised or cleared without changing completion or assessment. */
export function updateLearnerObservation(record: LearnerLearningRecord, observation: string | undefined): LearnerLearningRecord {
  if (observation !== undefined && !nonEmpty(observation)) throw new LearningRecordError('INVALID_LEARNER_RECORD');
  if (observation === undefined) {
    const { observation: _observation, ...withoutObservation } = record;
    return Object.freeze(withoutObservation);
  }
  return Object.freeze({ ...record, observation });
}

/** Outcome judgements require an explicit parent action and versioned curriculum context. */
export function assessOutcome(input: OutcomeAssessment, learnerRecord: LearnerLearningRecord): OutcomeAssessment {
  if (![input.id, input.learnerRecordId, input.outcomeId, input.assessedBy].every(nonEmpty) || input.learnerRecordId !== learnerRecord.id || !instant(input.assessedAt) || !['emerging', 'developing', 'demonstrated', 'not-assessed'].includes(input.judgement) || (input.rationale !== undefined && !nonEmpty(input.rationale))) {
    throw new LearningRecordError('INVALID_ASSESSMENT');
  }
  if (learnerRecord.curriculumVersionId === undefined) throw new LearningRecordError('OUTCOME_VERSION_REQUIRED');
  return Object.freeze({ ...input });
}
