import { expect, test } from 'vitest';
import { buildApp } from '../src/app.js';
const body = { id:'custom:math:v1', curriculumId:'custom:math', versionLabel:'1', provenance:{kind:'family',publisher:'Family',curriculumId:'custom:math',versionLabel:'1',effectiveFrom:'2026-01-01',retrievedAt:'2026-11-20T00:00:00Z'},outcomes:[{id:'custom:math:v1:o1',code:'M1',title:'Count objects'}] };
test('curriculum API validates, creates, retrieves and lists an immutable version', async () => {
 const app=buildApp();
 try {
  const created=await app.inject({method:'POST',url:'/api/v1/curricula',payload:body});
  expect(created.statusCode).toBe(201);
  expect(created.headers.location).toBe('/api/v1/curricula/custom%3Amath%3Av1');
  expect(created.headers['cache-control']).toBe('no-store');
  expect((await app.inject({method:'GET',url:'/api/v1/curricula/custom%3Amath%3Av1'})).json()).toEqual(body);
  expect((await app.inject({method:'GET',url:'/api/v1/curricula'})).json()).toEqual([body]);
  expect((await app.inject({method:'POST',url:'/api/v1/curricula',payload:body})).statusCode).toBe(409);
 } finally { await app.close(); }
});
test('rejects malformed and invalid curriculum payloads without leaking details', async () => {
 const app=buildApp();
 try {
  const malformed=await app.inject({method:'POST',url:'/api/v1/curricula',payload:{...body,unexpected:'secret'}});
  expect(malformed.statusCode).toBe(400);
  expect(malformed.json()).toEqual({error:'INVALID_REQUEST'});
  const invalid=await app.inject({method:'POST',url:'/api/v1/curricula',payload:{...body,outcomes:[]}});
  expect(invalid.statusCode).toBe(400);
  expect(invalid.json()).toEqual({error:'INVALID_VERSION'});
  expect((await app.inject({method:'GET',url:'/api/v1/curricula/missing'})).statusCode).toBe(404);
 } finally { await app.close(); }
});
