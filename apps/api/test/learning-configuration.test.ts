import { describe, expect, test } from 'vitest';
import { ConfigurationError, parseConfigurationLayer, resolveLearningConfiguration, type ConfigurationCatalog } from '../src/modules/learning-configuration/index.js';
const catalog: ConfigurationCatalog = { definitions: { curriculum: ['goal:v1', 'goal:v2'], pedagogy: ['custom-a', 'custom-b'], scheduling: ['flexible', 'fixed'], assessment: ['observation', 'grade'] }, conflicts: [[{ dimension: 'scheduling', id: 'flexible' }, { dimension: 'scheduling', id: 'fixed' }]] };
describe('learning configuration', () => {
  test('resolves dimensions independently with full precedence and provenance', () => {
    const result = resolveLearningConfiguration({ family: { curriculum: ['goal:v1'], pedagogy: ['custom-a'], assessment: ['observation'] }, learner: { pedagogy: ['custom-b'] }, subject: { scheduling: ['fixed'] }, activity: { curriculum: ['goal:v2'] } }, catalog);
    expect(result.values).toEqual({ curriculum: ['goal:v2'], pedagogy: ['custom-b'], scheduling: ['fixed'], assessment: ['observation'] });
    expect(result.sources).toEqual({ curriculum: 'activity', pedagogy: 'learner', scheduling: 'subject', assessment: 'family' });
  });
  test('each successive layer wins and removal restores inheritance', () => {
    const family = { pedagogy: ['custom-a'] };
    const learner = { pedagogy: ['custom-b'] };
    const subject = { pedagogy: ['custom-a'] };
    expect(resolveLearningConfiguration({ family, learner, subject, activity: { pedagogy: ['custom-b'] } }, catalog).sources.pedagogy).toBe('activity');
    expect(resolveLearningConfiguration({ family, learner, subject }, catalog).sources.pedagogy).toBe('subject');
    expect(resolveLearningConfiguration({ family, learner }, catalog).values.pedagogy).toEqual(['custom-b']);
    expect(resolveLearningConfiguration({ family }, catalog).values.pedagogy).toEqual(['custom-a']);
  });
  test('empty selection clears; missing selection inherits; collections replace', () => {
    const family = { curriculum: ['goal:v1', 'goal:v2'], assessment: ['observation'] };
    const result = resolveLearningConfiguration({ family, learner: { curriculum: ['goal:v2'], assessment: [] } }, catalog);
    expect(result.values.curriculum).toEqual(['goal:v2']);
    expect(result.values.assessment).toEqual([]);
    expect(result.sources.assessment).toBe('learner');
    expect(resolveLearningConfiguration({}, catalog).sources.curriculum).toBe('default');
  });
  test.each([null, [], { extra: [] }, { pedagogy: null }, { pedagogy: undefined }, { pedagogy: [''] }, { pedagogy: [' custom-a'] }, { pedagogy: ['custom-a', 'custom-a'] }])('rejects malformed layer %j', input => {
    expect(() => parseConfigurationLayer(input, catalog)).toThrow(ConfigurationError);
  });
  test('rejects unknown references even when a later layer overrides them', () => {
    expect(() => resolveLearningConfiguration({ family: { pedagogy: ['unknown'] }, activity: { pedagogy: ['custom-a'] } }, catalog)).toThrow('UNKNOWN_REFERENCE');
  });
  test('uses configurable conflicts on final selections without hardcoded philosophy', () => {
    expect(() => resolveLearningConfiguration({ family: { scheduling: ['fixed', 'flexible'] } }, catalog)).toThrow('CONFLICT');
    expect(resolveLearningConfiguration({ family: { scheduling: ['fixed', 'flexible'] }, activity: { scheduling: ['flexible'] } }, catalog).values.scheduling).toEqual(['flexible']);
  });
  test('rejects conflicts referencing missing definitions', () => {
    expect(() => resolveLearningConfiguration({}, { ...catalog, conflicts: [[{ dimension: 'pedagogy', id: 'absent' }, { dimension: 'pedagogy', id: 'custom-a' }]] })).toThrow('INVALID_CATALOG');
  });
  test('shared activity resolves separately per learner', () => {
    const activity = { scheduling: ['flexible'] };
    const first = resolveLearningConfiguration({ learner: { pedagogy: ['custom-a'] }, activity }, catalog);
    const second = resolveLearningConfiguration({ learner: { pedagogy: ['custom-b'] }, activity }, catalog);
    expect(first.values.pedagogy).toEqual(['custom-a']);
    expect(second.values.pedagogy).toEqual(['custom-b']);
    expect(first.values.scheduling).toEqual(second.values.scheduling);
  });
  test('snapshots are detached and immutable across later changes', () => {
    const family = { curriculum: ['goal:v1'] };
    const before = resolveLearningConfiguration({ family }, catalog);
    family.curriculum[0] = 'goal:v2';
    const after = resolveLearningConfiguration({ family }, catalog);
    expect(before.values.curriculum).toEqual(['goal:v1']);
    expect(after.values.curriculum).toEqual(['goal:v2']);
    expect(Object.isFrozen(before)).toBe(true);
    expect(Object.isFrozen(before.values)).toBe(true);
    expect(Object.isFrozen(before.values.curriculum)).toBe(true);
    expect(Object.isFrozen(before.sources)).toBe(true);
  });
});
