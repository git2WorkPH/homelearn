import { expect, test } from 'vitest';
import { buildApp } from '../src/app.js';
const plan={id:'plan-1',familyId:'family-local',title:'Week 1',startsOn:'2026-11-23',endsOn:'2026-11-29',status:'draft'};
test('supports plan, scheduled activity, spontaneous learning and explicit assessment',async()=>{
 const app=buildApp();try{
  expect((await app.inject({method:'POST',url:'/api/v1/plans',payload:plan})).statusCode).toBe(201);
  const activity=await app.inject({method:'POST',url:'/api/v1/activities',payload:{id:'activity-1',familyId:'family-local',planId:'plan-1',title:'Reading',learnerIds:['learner-a','learner-b'],schedule:{startsAt:'2026-11-24T01:00:00Z',endsAt:'2026-11-24T02:00:00Z',timeZone:'Australia/Sydney'}}});
  expect(activity.statusCode).toBe(201);
  const moved=await app.inject({method:'POST',url:'/api/v1/activities/activity-1/reschedule',payload:{schedule:{startsAt:'2026-11-25T01:00:00Z',endsAt:'2026-11-25T02:00:00Z',timeZone:'Australia/Sydney'},changedAt:'2026-11-20T00:00:00Z',changedBy:'adult-local'}});
  expect(moved.json().scheduleHistory).toHaveLength(1);
  const experience=await app.inject({method:'POST',url:'/api/v1/learning-experiences',payload:{id:'experience-1',familyId:'family-local',happenedAt:'2026-11-24T03:00:00Z',title:'Unplanned garden study'}});
  expect(experience.statusCode).toBe(201);
  const record=await app.inject({method:'POST',url:'/api/v1/learner-records',payload:{id:'record-1',experienceId:'experience-1',learnerId:'learner-a',completed:true,curriculumVersionId:'curriculum:v1',configurationSnapshot:{pedagogy:['interest-led']}}});
  expect(record.statusCode).toBe(201);
  const assessment=await app.inject({method:'POST',url:'/api/v1/learner-records/record-1/assessments',payload:{id:'assessment-1',learnerRecordId:'record-1',outcomeId:'outcome:v1:o1',assessedAt:'2026-11-24T04:00:00Z',assessedBy:'adult-local',judgement:'developing'}});
  expect(assessment.statusCode).toBe(201);
  const completedWithoutSnapshot=await app.inject({method:'POST',url:'/api/v1/learner-records',payload:{id:'record-2',experienceId:'experience-1',learnerId:'learner-b',completed:true}});
  expect(completedWithoutSnapshot.statusCode).toBe(201);
  const rejected=await app.inject({method:'POST',url:'/api/v1/learner-records/record-2/assessments',payload:{id:'assessment-2',learnerRecordId:'record-2',outcomeId:'outcome',assessedAt:'2026-11-24T04:00:00Z',assessedBy:'adult-local',judgement:'demonstrated'}});
  expect(rejected.statusCode).toBe(400);
 }finally{await app.close();}
});
