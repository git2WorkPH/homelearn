import type { Activity, LearningPlan, ScheduleRevision } from '../domain/planning.js';
export interface PlanningRepository {
  createPlan(plan: LearningPlan): Promise<LearningPlan>;
  getPlan(id: string, familyId: string): Promise<LearningPlan | undefined>;
  listPlans(familyId: string): Promise<readonly LearningPlan[]>;
  createActivity(activity: Activity): Promise<Activity>;
  getActivity(id: string, familyId: string): Promise<Activity | undefined>;
  listActivities(familyId: string, planId?: string): Promise<readonly Activity[]>;
  updateActivity(activity: Activity, addedScheduleRevision?: ScheduleRevision): Promise<Activity>;
}
