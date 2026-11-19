export interface CurriculumProvenance {
  readonly kind: 'official' | 'family';
  readonly publisher: string;
  readonly sourceUrl?: string;
  readonly curriculumId: string;
  readonly versionLabel: string;
  readonly effectiveFrom: string;
  readonly effectiveTo?: string;
  readonly retrievedAt: string;
}
export interface LearningOutcome {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly description?: string;
}
export interface CurriculumVersion {
  readonly id: string;
  readonly curriculumId: string;
  readonly versionLabel: string;
  readonly provenance: CurriculumProvenance;
  readonly outcomes: readonly LearningOutcome[];
}
export interface LearnerGoal {
  readonly id: string;
  readonly learnerId: string;
  readonly outcomeId: string;
  readonly curriculumVersionId: string;
  readonly createdAt: string;
}
export class CurriculumError extends Error {
  constructor(readonly code: 'INVALID_VERSION' | 'INVALID_OUTCOME' | 'DUPLICATE_OUTCOME' | 'INVALID_GOAL' | 'OUTCOME_VERSION_MISMATCH') {
    super(`Curriculum data rejected: ${code}`);
    this.name = 'CurriculumError';
  }
}
function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
function required(value: string): boolean { return value.trim().length > 0 && value === value.trim(); }
function freezeVersion(input: CurriculumVersion): CurriculumVersion {
  return Object.freeze({ ...input, provenance: Object.freeze({ ...input.provenance }), outcomes: Object.freeze(input.outcomes.map(outcome => Object.freeze({ ...outcome }))) });
}
/** Validate and detach a published curriculum version; subsequent edits create a new version. */
export function publishCurriculumVersion(input: CurriculumVersion): CurriculumVersion {
  const { provenance } = input;
  if (![input.id, input.curriculumId, input.versionLabel, provenance.publisher, provenance.curriculumId, provenance.versionLabel].every(required) || input.id !== provenance.curriculumId && input.curriculumId !== provenance.curriculumId || !isDate(provenance.effectiveFrom) || !Number.isFinite(Date.parse(provenance.retrievedAt)) || (provenance.effectiveTo !== undefined && (!isDate(provenance.effectiveTo) || provenance.effectiveTo < provenance.effectiveFrom)) || Number.isNaN(Date.parse(provenance.retrievedAt)) || (provenance.kind === 'official' && (!provenance.sourceUrl || !URL.canParse(provenance.sourceUrl))) || (provenance.kind === 'family' && provenance.sourceUrl !== undefined && !URL.canParse(provenance.sourceUrl))) throw new CurriculumError('INVALID_VERSION');
  if (input.outcomes.length === 0) throw new CurriculumError('INVALID_VERSION');
  const ids = new Set<string>();
  const codes = new Set<string>();
  for (const outcome of input.outcomes) {
    if (![outcome.id, outcome.code, outcome.title].every(required) || (outcome.description !== undefined && !required(outcome.description))) throw new CurriculumError('INVALID_OUTCOME');
    if (ids.has(outcome.id) || codes.has(outcome.code)) throw new CurriculumError('DUPLICATE_OUTCOME');
    ids.add(outcome.id); codes.add(outcome.code);
  }
  return freezeVersion(input);
}
/** Bind a learner's goal to one exact immutable outcome version. */
export function createLearnerGoal(input: LearnerGoal, version: CurriculumVersion): LearnerGoal {
  if (![input.id, input.learnerId, input.outcomeId, input.curriculumVersionId].every(required) || Number.isNaN(Date.parse(input.createdAt)) || !input.createdAt.endsWith('Z')) throw new CurriculumError('INVALID_GOAL');
  if (version.id !== input.curriculumVersionId || !version.outcomes.some(outcome => outcome.id === input.outcomeId)) throw new CurriculumError('OUTCOME_VERSION_MISMATCH');
  return Object.freeze({ ...input });
}
