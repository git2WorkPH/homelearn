import { randomUUID } from 'node:crypto';
import { Prisma } from '../../../generated/prisma/client.js';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Activity, LearningPlan, Schedule, ScheduleRevision } from '../domain/planning.js';
import type { PlanningRepository } from '../application/planning-repository.js';

export class PrismaPlanningRepository implements PlanningRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createPlan(plan: LearningPlan): Promise<LearningPlan> {
    const row = await this.prisma.learningPlan.create({ data: { ...plan, startsOn: new Date(`${plan.startsOn}T00:00:00Z`), endsOn: new Date(`${plan.endsOn}T00:00:00Z`) } });
    return { ...row, startsOn: row.startsOn.toISOString().slice(0, 10), endsOn: row.endsOn.toISOString().slice(0, 10), status: row.status as LearningPlan['status'] };
  }

  async getPlan(id: string): Promise<LearningPlan | undefined> {
    const row = await this.prisma.learningPlan.findUnique({ where: { id } });
    return row === null ? undefined : { ...row, startsOn: row.startsOn.toISOString().slice(0, 10), endsOn: row.endsOn.toISOString().slice(0, 10), status: row.status as LearningPlan['status'] };
  }

  async listPlans(): Promise<readonly LearningPlan[]> {
    const rows = await this.prisma.learningPlan.findMany({ orderBy: { startsOn: 'desc' } });
    return rows.map(row => ({ ...row, startsOn: row.startsOn.toISOString().slice(0, 10), endsOn: row.endsOn.toISOString().slice(0, 10), status: row.status as LearningPlan['status'] }));
  }

  async createActivity(activity: Activity): Promise<Activity> {
    await this.prisma.activity.create({ data: { id: activity.id, familyId: activity.familyId, planId: activity.planId, title: activity.title, lessonVersionId: activity.lessonVersionId ?? null, schedule: activity.schedule === undefined ? Prisma.DbNull : { startsAt: activity.schedule.startsAt, endsAt: activity.schedule.endsAt, timeZone: activity.schedule.timeZone }, assignments: { create: activity.learnerIds.map(learnerId => ({ learnerId })) } } });
    return activity;
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    const row = await this.prisma.activity.findUnique({ where: { id }, include: { assignments: { orderBy: { learnerId: 'asc' } }, revisions: { orderBy: { changedAt: 'asc' } } } });
    return row === null ? undefined : this.mapActivity(row);
  }

  async listActivities(planId?: string): Promise<readonly Activity[]> {
    const rows = await this.prisma.activity.findMany({ where: planId === undefined ? {} : { planId }, include: { assignments: { orderBy: { learnerId: 'asc' } }, revisions: { orderBy: { changedAt: 'asc' } } }, orderBy: { createdAt: 'asc' } });
    return rows.map(row => this.mapActivity(row));
  }

  async updateActivity(activity: Activity, revision?: ScheduleRevision): Promise<Activity> {
    const existing = await this.getActivity(activity.id);
    if (existing === undefined) throw new Error('ACTIVITY_NOT_FOUND');
    await this.prisma.$transaction(async tx => {
      await tx.activity.update({ where: { id: activity.id }, data: { title: activity.title, lessonVersionId: activity.lessonVersionId ?? null, schedule: activity.schedule === undefined ? Prisma.DbNull : { startsAt: activity.schedule.startsAt, endsAt: activity.schedule.endsAt, timeZone: activity.schedule.timeZone } } });
      await tx.activityAssignment.deleteMany({ where: { activityId: activity.id } });
      await tx.activityAssignment.createMany({ data: activity.learnerIds.map(learnerId => ({ activityId: activity.id, learnerId })) });
      if (revision !== undefined) await tx.activityScheduleRevision.create({ data: { id: randomUUID(), activityId: activity.id, previous: revision.previous === undefined ? Prisma.DbNull : { startsAt: revision.previous.startsAt, endsAt: revision.previous.endsAt, timeZone: revision.previous.timeZone }, next: revision.next === undefined ? Prisma.DbNull : { startsAt: revision.next.startsAt, endsAt: revision.next.endsAt, timeZone: revision.next.timeZone }, changedAt: new Date(revision.changedAt), changedBy: revision.changedBy } });
    });
    return activity;
  }

  private mapActivity(row: { id: string; familyId: string; planId: string; title: string; lessonVersionId: string | null; schedule: unknown; assignments: readonly { learnerId: string }[]; revisions: readonly { previous: unknown; next: unknown; changedAt: Date; changedBy: string }[] }): Activity {
    const schedule = row.schedule === null ? undefined : row.schedule as Schedule;
    const scheduleHistory: ScheduleRevision[] = row.revisions.map(item => ({ ...(item.previous === null ? {} : { previous: item.previous as Schedule }), ...(item.next === null ? {} : { next: item.next as Schedule }), changedAt: item.changedAt.toISOString(), changedBy: item.changedBy }));
    return { id: row.id, familyId: row.familyId, planId: row.planId, title: row.title, learnerIds: row.assignments.map(item => item.learnerId), ...(row.lessonVersionId === null ? {} : { lessonVersionId: row.lessonVersionId }), ...(schedule === undefined ? {} : { schedule }), scheduleHistory };
  }
}
