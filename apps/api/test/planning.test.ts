import { expect, test } from 'vitest';
import { assignActivityToLearners, assignActivityToPlan, createActivity, createLearningPlan, editActivity, PlanningError, rescheduleActivity } from '../src/modules/planning/index.js';
const plan = () => createLearningPlan({ id:'plan-1', familyId:'family-1', title:'Week 1', startsOn:'2026-11-23', endsOn:'2026-11-29', status:'draft' });
const scheduled = () => createActivity({ id:'activity-1', familyId:'family-1', planId:'plan-1', title:'Garden observations', learnerIds:['learner-a','learner-b'], schedule:{startsAt:'2026-11-24T01:00:00Z',endsAt:'2026-11-24T02:00:00Z',timeZone:'Australia/Sydney'} });
test('supports plans, shared assignments and unscheduled activities', () => {
 expect(plan().status).toBe('draft');
 expect(createActivity({id:'activity-2',familyId:'family-1',planId:'plan-1',title:'Spontaneous reading',learnerIds:['learner-a']}).schedule).toBeUndefined();
 expect(assignActivityToPlan(scheduled(),plan()).familyId).toBe('family-1');
});
test('records schedule changes and preserves scheduling history', () => {
 const first=scheduled();
 const moved=rescheduleActivity(first,{startsAt:'2026-11-25T01:00:00Z',endsAt:'2026-11-25T02:00:00Z',timeZone:'Australia/Sydney'},'2026-11-20T00:00:00Z','parent-1');
 expect(moved.schedule?.startsAt).toBe('2026-11-25T01:00:00Z');
 expect(moved.scheduleHistory[0]?.previous?.startsAt).toBe(first.schedule?.startsAt);
 const unscheduled=rescheduleActivity(moved,undefined,'2026-11-20T00:01:00Z','parent-1');
 expect(unscheduled.schedule).toBeUndefined();
 expect(unscheduled.scheduleHistory).toHaveLength(2);
 expect(unscheduled.scheduleHistory[1]?.previous?.startsAt).toBe(moved.schedule?.startsAt);
 expect(unscheduled.scheduleHistory[1]?.next).toBeUndefined();
 expect(first.schedule?.startsAt).toBe('2026-11-24T01:00:00Z');
});
test('reassigns learner set without coupling learner progress', () => {
 const updated=assignActivityToLearners(scheduled(),['learner-b']);
 expect(updated.learnerIds).toEqual(['learner-b']);
 expect(scheduled().learnerIds).toEqual(['learner-a','learner-b']);
});
test('edits activity title and assignments while retaining schedule history', () => {
 const activity=scheduled();
 const rescheduled=rescheduleActivity(activity,{startsAt:'2026-11-25T01:00:00Z',endsAt:'2026-11-25T02:00:00Z',timeZone:'Australia/Sydney'},'2026-11-20T00:00:00Z','parent-1');
 const edited=editActivity(rescheduled,{title:'Updated garden activity',learnerIds:['learner-b']});
 expect(edited.title).toBe('Updated garden activity');
 expect(edited.learnerIds).toEqual(['learner-b']);
 expect(edited.scheduleHistory).toEqual(rescheduled.scheduleHistory);
 expect(()=>editActivity(activity,{title:' '})).toThrow('INVALID_ACTIVITY');
 expect(()=>editActivity(activity,{learnerIds:['learner-a','learner-a']})).toThrow('DUPLICATE_LEARNER');
});
test('rejects invalid date range, duplicate assignments and family mismatch', () => {
 expect(() => createLearningPlan({...plan(), endsOn:'2026-11-01'})).toThrow(PlanningError);
 expect(() => createActivity({id:'a',familyId:'f',planId:'p',title:'x',learnerIds:['l','l']})).toThrow('DUPLICATE_LEARNER');
 expect(() => assignActivityToPlan(scheduled(),createLearningPlan({id:'p2',familyId:'other',title:'Other',startsOn:'2026-11-23',endsOn:'2026-11-23',status:'active'}))).toThrow('PLAN_FAMILY_MISMATCH');
});
test('rejects invalid or non-increasing schedules and revision metadata', () => {
 expect(() => createActivity({id:'a',familyId:'f',planId:'p',title:'x',learnerIds:['l'],schedule:{startsAt:'2026-11-24',endsAt:'2026-11-23',timeZone:'UTC'}})).toThrow('INVALID_SCHEDULE');
 expect(() => rescheduleActivity(scheduled(),undefined,'not-date','')).toThrow('INVALID_REVISION');
});
