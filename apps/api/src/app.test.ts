import { expect, test } from 'vitest';
import { buildApp } from './app.js';
test('health is available without exposing internals; unknown routes fail', async () => {
  const app = buildApp();
  try {
    const response = await app.inject({ method: 'GET', url: '/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
    expect((await app.inject({ method: 'GET', url: '/learners' })).statusCode).toBe(404);
  } finally { await app.close(); }
});
