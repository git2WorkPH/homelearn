import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { assignActivityToPlan, createActivity, createLearningPlan, editActivity, PlanningError, rescheduleActivity } from '../domain/planning.js';
import type { PlanningRepository } from '../application/planning-repository.js';
const planSchema = z.object({ id: z.string(), familyId: z.string(), title: z.string(), startsOn: z.string(), endsOn: z.string(), status: z.enum(['draft','active','archived']) }).strict();
const scheduleSchema = z.object({ startsAt: z.string(), endsAt: z.string(), timeZone: z.string() }).strict();
const activitySchema = z.object({ id: z.string(), familyId: z.string(), planId: z.string(), title: z.string(), learnerIds: z.array(z.string()).min(1), schedule: scheduleSchema.optional() }).strict();
export async function registerPlanningRoutes(app: FastifyInstance, repository: PlanningRepository): Promise<void> {
  app.get('/api/v1/plans', async (_request, reply) => reply.header('cache-control','no-store').send(await repository.listPlans()));
  app.post('/api/v1/plans', async (request, reply) => {
    const parsed=planSchema.safeParse(request.body); if(!parsed.success) return reply.code(400).send({error:'INVALID_REQUEST'});
    try { const plan=createLearningPlan(parsed.data); const saved=await repository.createPlan(plan); return reply.code(201).header('location',`/api/v1/plans/${encodeURIComponent(saved.id)}`).send(saved); }
    catch(error) { if(error instanceof PlanningError) return reply.code(400).send({error:error.code}); if(error instanceof Error&&error.message==='DUPLICATE_PLAN') return reply.code(409).send({error:'PLAN_ALREADY_EXISTS'}); throw error; }
  });
  app.get('/api/v1/activities', async (request,reply) => { const query=z.object({planId:z.string().optional()}).safeParse(request.query); if(!query.success)return reply.code(400).send({error:'INVALID_REQUEST'}); return reply.header('cache-control','no-store').send(await repository.listActivities(query.data.planId)); });
  app.post('/api/v1/activities', async (request,reply) => {
    const parsed=activitySchema.safeParse(request.body); if(!parsed.success)return reply.code(400).send({error:'INVALID_REQUEST'});
    try { const plan=await repository.getPlan(parsed.data.planId); if(plan===undefined)return reply.code(404).send({error:'PLAN_NOT_FOUND'}); const input=parsed.data; const activity=createActivity({ id:input.id, familyId:input.familyId, planId:input.planId, title:input.title, learnerIds:input.learnerIds, ...(input.schedule===undefined?{}:{schedule:input.schedule}) }); assignActivityToPlan(activity,plan); const saved=await repository.createActivity(activity); return reply.code(201).header('location',`/api/v1/activities/${encodeURIComponent(saved.id)}`).send(saved); }
    catch(error) { if(error instanceof PlanningError)return reply.code(400).send({error:error.code}); if(error instanceof Error&&error.message==='DUPLICATE_ACTIVITY')return reply.code(409).send({error:'ACTIVITY_ALREADY_EXISTS'}); throw error; }
  });
  app.patch<{Params:{activityId:string}}>('/api/v1/activities/:activityId', async (request, reply) => {
    const parsed = z.object({ title: z.string().optional(), learnerIds: z.array(z.string()).min(1).optional(), schedule: scheduleSchema.nullable().optional(), changedAt: z.string().optional(), changedBy: z.string().optional() }).strict().refine(input => input.title !== undefined || input.learnerIds !== undefined || Object.hasOwn(input, 'schedule')).safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: 'INVALID_REQUEST' });
    const current = await repository.getActivity(request.params.activityId);
    if (current === undefined) return reply.code(404).send({ error: 'ACTIVITY_NOT_FOUND' });
    try {
      let updated = editActivity(current, { ...(parsed.data.title === undefined ? {} : { title: parsed.data.title }), ...(parsed.data.learnerIds === undefined ? {} : { learnerIds: parsed.data.learnerIds }) });
      let revision = undefined;
      if (Object.hasOwn(parsed.data, 'schedule')) {
        if (parsed.data.changedAt === undefined || parsed.data.changedBy === undefined) return reply.code(400).send({ error: 'SCHEDULE_CHANGE_AUDIT_REQUIRED' });
        const previousHistoryLength = updated.scheduleHistory.length;
        updated = rescheduleActivity(updated, parsed.data.schedule ?? undefined, parsed.data.changedAt, parsed.data.changedBy);
        if (updated.scheduleHistory.length > previousHistoryLength) revision = updated.scheduleHistory.at(-1);
      }
      return reply.send(await repository.updateActivity(updated, revision));
    } catch (error) {
      if (error instanceof PlanningError) return reply.code(400).send({ error: error.code });
      throw error;
    }
  });
  app.post<{Params:{activityId:string}}>('/api/v1/activities/:activityId/reschedule',async(request,reply)=>{
    const parsed=z.object({schedule:scheduleSchema.optional(),changedAt:z.string(),changedBy:z.string()}).strict().safeParse(request.body); if(!parsed.success)return reply.code(400).send({error:'INVALID_REQUEST'});
    const activity=await repository.getActivity(request.params.activityId); if(activity===undefined)return reply.code(404).send({error:'ACTIVITY_NOT_FOUND'});
    try { const updated=rescheduleActivity(activity,parsed.data.schedule,parsed.data.changedAt,parsed.data.changedBy); const revision=updated.scheduleHistory.length>activity.scheduleHistory.length?updated.scheduleHistory.at(-1):undefined; return reply.send(await repository.updateActivity(updated,revision)); } catch(error){if(error instanceof PlanningError)return reply.code(400).send({error:error.code});throw error;}
  });
}
