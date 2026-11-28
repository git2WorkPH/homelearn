import type { Activity, LearningPlan } from '../domain/planning.js';
import type { PlanningRepository } from '../application/planning-repository.js';
export class InMemoryPlanningRepository implements PlanningRepository {
  readonly #plans = new Map<string, LearningPlan>();
  readonly #activities = new Map<string, Activity>();
  async createPlan(plan: LearningPlan): Promise<LearningPlan> { if (this.#plans.has(plan.id)) throw new Error('DUPLICATE_PLAN'); this.#plans.set(plan.id, plan); return plan; }
  async getPlan(id: string, familyId: string): Promise<LearningPlan | undefined> { const item = this.#plans.get(id); return item?.familyId === familyId ? item : undefined; }
  async listPlans(familyId: string): Promise<readonly LearningPlan[]> { return [...this.#plans.values()].filter(item => item.familyId === familyId); }
  async createActivity(activity: Activity): Promise<Activity> { if (this.#activities.has(activity.id)) throw new Error('DUPLICATE_ACTIVITY'); this.#activities.set(activity.id, activity); return activity; }
  async getActivity(id: string, familyId: string): Promise<Activity | undefined> { const item = this.#activities.get(id); return item?.familyId === familyId ? item : undefined; }
  async listActivities(familyId: string, planId?: string): Promise<readonly Activity[]> { return [...this.#activities.values()].filter(item => item.familyId === familyId && (planId === undefined || item.planId === planId)); }
  async updateActivity(activity: Activity): Promise<Activity> { if (!this.#activities.has(activity.id)) throw new Error('ACTIVITY_NOT_FOUND'); this.#activities.set(activity.id, activity); return activity; }
}
