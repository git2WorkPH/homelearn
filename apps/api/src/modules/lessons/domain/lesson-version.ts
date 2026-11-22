export type LessonCreationMethod = 'manual' | 'ai-generated';

export interface LessonVersion {
  readonly id: string;
  readonly lessonKey: string;
  readonly familyId: string;
  readonly versionLabel: string;
  readonly title: string;
  readonly subject: string;
  readonly strand: string;
  readonly learningLevel: string;
  readonly learningGoal: string;
  readonly successCriteria: readonly string[];
  readonly description?: string;
  readonly materials: readonly string[];
  readonly steps: readonly string[];
  readonly adaptation?: string;
  readonly estimatedMinutes?: number;
  readonly creationMethod: LessonCreationMethod;
  readonly aiProvider?: string;
  readonly aiModel?: string;
  readonly parentApprovedAt?: string;
  readonly createdAt: string;
}

export interface LessonDraftRequest {
  readonly subject: string;
  readonly strand: string;
  readonly learningLevel: string;
  readonly topic: string;
  readonly teachingNotes?: string;
}

export type LessonDraft = Pick<LessonVersion,
  'title' | 'subject' | 'strand' | 'learningLevel' | 'learningGoal' |
  'successCriteria' | 'description' | 'materials' | 'steps' | 'adaptation' | 'estimatedMinutes'>;

export class LessonError extends Error {
  constructor(readonly code: 'INVALID_LESSON' | 'INVALID_DRAFT' | 'AI_UNAVAILABLE' | 'AI_INVALID_OUTPUT') {
    super(`Lesson operation rejected: ${code}`);
    this.name = 'LessonError';
  }
}

function nonEmpty(value: string): boolean {
  return value.trim().length > 0 && value === value.trim();
}

function validTextList(values: readonly string[], allowEmpty: boolean): boolean {
  return (allowEmpty || values.length > 0) && values.length <= 30 && values.every(value => nonEmpty(value) && value.length <= 1000);
}

function validTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value)) && value.endsWith('Z');
}

export function createLessonVersion(input: LessonVersion): LessonVersion {
  if (![input.id, input.lessonKey, input.familyId, input.versionLabel, input.title, input.subject, input.strand, input.learningLevel, input.learningGoal].every(nonEmpty) ||
    input.id.length > 300 || input.lessonKey.length > 200 || input.familyId.length > 200 || input.versionLabel.length > 40 ||
    input.title.length > 300 || input.subject.length > 120 || input.strand.length > 160 || input.learningLevel.length > 80 || input.learningGoal.length > 1000 ||
    !validTextList(input.successCriteria, true) || !validTextList(input.materials, true) || !validTextList(input.steps, false) ||
    input.steps.length > 20 || (input.description !== undefined && (!nonEmpty(input.description) || input.description.length > 5000)) ||
    (input.adaptation !== undefined && (!nonEmpty(input.adaptation) || input.adaptation.length > 5000)) ||
    (input.estimatedMinutes !== undefined && (!Number.isInteger(input.estimatedMinutes) || input.estimatedMinutes < 1 || input.estimatedMinutes > 480)) ||
    !['manual', 'ai-generated'].includes(input.creationMethod) || !validTimestamp(input.createdAt) ||
    (input.parentApprovedAt !== undefined && !validTimestamp(input.parentApprovedAt)) ||
    (input.parentApprovedAt !== undefined && Date.parse(input.parentApprovedAt) > Date.parse(input.createdAt)) ||
    (input.creationMethod === 'ai-generated' && (input.parentApprovedAt === undefined || input.aiProvider === undefined || input.aiModel === undefined)) ||
    (input.aiProvider !== undefined && !nonEmpty(input.aiProvider)) || (input.aiModel !== undefined && !nonEmpty(input.aiModel))) {
    throw new LessonError('INVALID_LESSON');
  }
  return Object.freeze({
    ...input,
    successCriteria: Object.freeze([...input.successCriteria]),
    materials: Object.freeze([...input.materials]),
    steps: Object.freeze([...input.steps]),
  });
}

export function validateLessonDraft(input: LessonDraft): LessonDraft {
  if (![input.title, input.subject, input.strand, input.learningLevel, input.learningGoal].every(nonEmpty) ||
    input.title.length > 300 || input.subject.length > 120 || input.strand.length > 160 || input.learningLevel.length > 80 || input.learningGoal.length > 1000 ||
    !validTextList(input.successCriteria, true) || !validTextList(input.materials, true) || !validTextList(input.steps, false) ||
    input.steps.length > 20 || (input.description !== undefined && (!nonEmpty(input.description) || input.description.length > 5000)) ||
    (input.adaptation !== undefined && (!nonEmpty(input.adaptation) || input.adaptation.length > 5000)) ||
    (input.estimatedMinutes !== undefined && (!Number.isInteger(input.estimatedMinutes) || input.estimatedMinutes < 1 || input.estimatedMinutes > 480))) {
    throw new LessonError('AI_INVALID_OUTPUT');
  }
  const text = [input.title, input.subject, input.strand, input.learningLevel, input.learningGoal, input.description ?? '', input.adaptation ?? '', ...input.successCriteria, ...input.materials, ...input.steps].join('\n');
  if (/\b(?:NESA[- ]approved|officially aligned|certifies? compliance|meets? (?:the )?(?:official )?(?:NSW )?syllabus requirements)\b/i.test(text)) throw new LessonError('AI_INVALID_OUTPUT');
  return Object.freeze({
    ...input,
    successCriteria: Object.freeze([...input.successCriteria]),
    materials: Object.freeze([...input.materials]),
    steps: Object.freeze([...input.steps]),
  });
}
