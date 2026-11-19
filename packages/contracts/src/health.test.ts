import { expect, test } from 'vitest';
import { healthResponseSchema } from './index.js';
test('rejects unexpected data and invalid status', () => {
  expect(healthResponseSchema.safeParse({ status: 'ok' }).success).toBe(true);
  expect(healthResponseSchema.safeParse({ status: 'failed' }).success).toBe(false);
  expect(healthResponseSchema.safeParse({ status: 'ok', internal: 'detail' }).success).toBe(false);
});
