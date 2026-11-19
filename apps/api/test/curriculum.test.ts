import { expect, test } from 'vitest';
import { createLearnerGoal, CurriculumError, publishCurriculumVersion } from '../src/modules/curriculum/index.js';
const source: import('../src/modules/curriculum/index.js').CurriculumVersion = { id:'syllabus:math:v1', curriculumId:'syllabus:math', versionLabel:'2026.1', provenance:{kind:'official',publisher:'Example Authority',sourceUrl:'https://example.test/syllabus',curriculumId:'syllabus:math',versionLabel:'2026.1',effectiveFrom:'2026-01-01',retrievedAt:'2026-11-20T00:00:00Z'}, outcomes:[{id:'outcome:v1:n1',code:'N1',title:'Explore number'}] } as const;
test('publishes detached immutable version with dated provenance', () => {
  const published = publishCurriculumVersion(source);
  expect(published.outcomes[0]?.title).toBe('Explore number');
  expect(Object.isFrozen(published.outcomes[0])).toBe(true);
});
test('creates learner goal tied to a specific outcome version', () => {
  const version = publishCurriculumVersion(source);
  expect(createLearnerGoal({id:'goal-1',learnerId:'learner-1',outcomeId:'outcome:v1:n1',curriculumVersionId:version.id,createdAt:'2026-11-20T01:00:00Z'},version).curriculumVersionId).toBe(version.id);
  expect(() => createLearnerGoal({id:'goal-2',learnerId:'learner-1',outcomeId:'outcome:v2:n1',curriculumVersionId:'syllabus:math:v2',createdAt:'2026-11-20T01:00:00Z'},version)).toThrow(CurriculumError);
});
test('rejects duplicate outcomes and invalid provenance dates', () => {
  expect(() => publishCurriculumVersion({...source,outcomes:[...source.outcomes,...source.outcomes]})).toThrow('DUPLICATE_OUTCOME');
  expect(() => publishCurriculumVersion({...source,provenance:{...source.provenance,effectiveFrom:'2026-02-30'}})).toThrow('INVALID_VERSION');
});
