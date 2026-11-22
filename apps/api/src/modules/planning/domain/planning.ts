export type PlanStatus = 'draft' | 'active' | 'archived';
export interface LearningPlan {
  readonly id: string;
  readonly familyId: string;
  readonly title: string;
  readonly startsOn: string;
  readonly endsOn: string;
  readonly status: PlanStatus;
}
export interface Schedule { readonly startsAt: string; readonly endsAt: string; readonly timeZone: string }
export interface ScheduleRevision { readonly previous?: Schedule; readonly next?: Schedule; readonly changedAt: string; readonly changedBy: string }
export interface Activity {
  readonly id: string;
  readonly familyId: string;
  readonly planId: string;
  readonly title: string;
  /** Stable catalogue version reference, e.g. story-shapes@demo-0.2. */
  readonly lessonVersionId?: string;
  /** Stable, source-controlled shared catalogue reference; independent of family lesson versions. */
  readonly catalogLessonRef?: string;
  readonly learnerIds: readonly string[];
  readonly schedule?: Schedule;
  readonly scheduleHistory: readonly ScheduleRevision[];
}
export class PlanningError extends Error {
  constructor(readonly code: 'INVALID_PLAN' | 'INVALID_ACTIVITY' | 'INVALID_SCHEDULE' | 'DUPLICATE_LEARNER' | 'PLAN_FAMILY_MISMATCH' | 'INVALID_REVISION') {
    super(`Planning data rejected: ${code}`);
    this.name = 'PlanningError';
  }
}
function nonEmpty(value: string): boolean { return value.trim().length > 0 && value === value.trim(); }
function validDay(value: string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value; }
function validateSchedule(schedule: Schedule): void {
  if (!Number.isFinite(Date.parse(schedule.startsAt)) || !Number.isFinite(Date.parse(schedule.endsAt)) || Date.parse(schedule.endsAt) <= Date.parse(schedule.startsAt) || !nonEmpty(schedule.timeZone)) throw new PlanningError('INVALID_SCHEDULE');
  try { const formatter = new Intl.DateTimeFormat('en', { timeZone: schedule.timeZone }); formatter.format(0); } catch { throw new PlanningError('INVALID_SCHEDULE'); }
}
function freezeSchedule(schedule: Schedule): Schedule { return Object.freeze({ ...schedule }); }
export function createLearningPlan(input: LearningPlan): LearningPlan {
  if (![input.id, input.familyId, input.title].every(nonEmpty) || !validDay(input.startsOn) || !validDay(input.endsOn) || input.endsOn < input.startsOn || !['draft', 'active', 'archived'].includes(input.status)) throw new PlanningError('INVALID_PLAN');
  return Object.freeze({ ...input });
}
export function createActivity(input: Omit<Activity, 'scheduleHistory'>): Activity {
  if (![input.id, input.familyId, input.planId, input.title].every(nonEmpty) || input.learnerIds.length === 0 || input.learnerIds.some(id => !nonEmpty(id))) throw new PlanningError('INVALID_ACTIVITY');
  if (input.lessonVersionId !== undefined && !nonEmpty(input.lessonVersionId)) throw new PlanningError('INVALID_ACTIVITY');
  if (input.catalogLessonRef !== undefined && !nonEmpty(input.catalogLessonRef)) throw new PlanningError('INVALID_ACTIVITY');
  if (new Set(input.learnerIds).size !== input.learnerIds.length) throw new PlanningError('DUPLICATE_LEARNER');
  if (input.schedule !== undefined) validateSchedule(input.schedule);
  return Object.freeze({ ...input, learnerIds: Object.freeze([...input.learnerIds]), ...(input.schedule === undefined ? {} : { schedule: freezeSchedule(input.schedule) }), scheduleHistory: Object.freeze([]) });
}
/** Scheduling changes preserve prior and next values, including scheduled-to-unscheduled changes. */
export function rescheduleActivity(activity: Activity, next: Schedule | undefined, changedAt: string, changedBy: string): Activity {
  if (!Number.isFinite(Date.parse(changedAt)) || !changedAt.endsWith('Z') || !nonEmpty(changedBy)) throw new PlanningError('INVALID_REVISION');
  if (next !== undefined) validateSchedule(next);
  if (next?.startsAt === activity.schedule?.startsAt && next?.endsAt === activity.schedule?.endsAt && next?.timeZone === activity.schedule?.timeZone) return activity;
  const revision: ScheduleRevision = Object.freeze({ ...(activity.schedule === undefined ? {} : { previous: freezeSchedule(activity.schedule) }), ...(next === undefined ? {} : { next: freezeSchedule(next) }), changedAt, changedBy });
  const updated = { ...activity, scheduleHistory: Object.freeze([...activity.scheduleHistory, revision]) };
  if (next === undefined) { const { schedule: _schedule, ...unscheduled } = updated; return Object.freeze(unscheduled); }
  return Object.freeze({ ...updated, schedule: freezeSchedule(next) });
}
export function assignActivityToLearners(activity: Activity, learnerIds: readonly string[]): Activity {
  if (learnerIds.length === 0 || learnerIds.some(id => !nonEmpty(id))) throw new PlanningError('INVALID_ACTIVITY');
  if (new Set(learnerIds).size !== learnerIds.length) throw new PlanningError('DUPLICATE_LEARNER');
  return Object.freeze({ ...activity, learnerIds: Object.freeze([...learnerIds]) });
}
export function editActivity(activity: Activity, changes: { readonly title?: string; readonly learnerIds?: readonly string[]; readonly lessonVersionId?: string | null; readonly catalogLessonRef?: string | null }): Activity {
  const title = changes.title ?? activity.title;
  if (!nonEmpty(title)) throw new PlanningError('INVALID_ACTIVITY');
  const updated = { ...activity, title };
  if (changes.lessonVersionId !== undefined && changes.lessonVersionId !== null && !nonEmpty(changes.lessonVersionId)) throw new PlanningError('INVALID_ACTIVITY');
  const withLesson = changes.lessonVersionId === undefined ? updated : changes.lessonVersionId === null ? withoutLessonVersion(updated) : { ...updated, lessonVersionId: changes.lessonVersionId };
  if (changes.catalogLessonRef !== undefined && changes.catalogLessonRef !== null && !nonEmpty(changes.catalogLessonRef)) throw new PlanningError('INVALID_ACTIVITY');
  const withCatalogLesson = changes.catalogLessonRef === undefined
    ? withLesson
    : changes.catalogLessonRef === null
      ? withoutCatalogLessonRef(withLesson)
      : { ...withLesson, catalogLessonRef: changes.catalogLessonRef };
  return changes.learnerIds === undefined ? Object.freeze(withCatalogLesson) : assignActivityToLearners(withCatalogLesson, changes.learnerIds);
}

function withoutLessonVersion(activity: Activity): Omit<Activity, 'lessonVersionId'> {
  const { lessonVersionId: _lessonVersionId, ...withoutLesson } = activity;
  return withoutLesson;
}
function withoutCatalogLessonRef(activity: Activity): Omit<Activity, 'catalogLessonRef'> {
  const { catalogLessonRef: _catalogLessonRef, ...withoutLesson } = activity;
  return withoutLesson;
}
export function assignActivityToPlan(activity: Activity, plan: LearningPlan): Activity {
  if (activity.familyId !== plan.familyId) throw new PlanningError('PLAN_FAMILY_MISMATCH');
  return activity;
}
