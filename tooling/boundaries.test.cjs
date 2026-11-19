const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
test('architecture check rejects forbidden domain dependencies', () => {
  const result = spawnSync('pnpm', ['exec', 'depcruise', '--config', '.dependency-cruiser.cjs', 'tests/architecture'], { encoding: 'utf8' });
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /domain-no-outer-layer/);
});
test('application source satisfies boundaries', () => {
  execFileSync('pnpm', ['boundaries'], { stdio: 'pipe' });
});
