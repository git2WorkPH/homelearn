import type { Activity, LearningPlan } from '../domain/planning.js';
export interface PlanningRepository {
  createPlan(plan: LearningPlan): Promise<LearningPlan>;
  getPlan(id: string): Promise<LearningPlan | undefined>;
  listPlans(): Promise<readonly LearningPlan[]>;
  createActivity(activity: Activity): Promise<Activity>;
  getActivity(id: string): Promise<Activity | undefined>;
  listActivities(planId?: string): Promise<readonly Activity[]>;
  updateActivity(activity: Activity): Promise<Activity>;
}
