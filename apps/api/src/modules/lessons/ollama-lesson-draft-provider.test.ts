import { expect, test } from 'vitest';
import { LessonError } from './domain/lesson-version.js';
import { OllamaLessonDraftProvider } from './infrastructure/ollama-lesson-draft-provider.js';

const validDraft = {
  title: 'Garden pattern walk', subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2',
  learningGoal: 'Notice and describe a repeating pattern.', successCriteria: ['Describe what repeats'],
  materials: ['Paper'], steps: ['Look for a pattern', 'Describe it'], adaptation: 'Use larger objects.', estimatedMinutes: 20,
};

test('uses a local Ollama endpoint and validates the generated lesson shape', async () => {
  let requestBody = '';
  const provider = new OllamaLessonDraftProvider('synthetic-model', 'http://127.0.0.1:11434', async (_input, init) => {
    requestBody = String(init?.body ?? '');
    return new Response(JSON.stringify({ response: JSON.stringify(validDraft) }), { status: 200 });
  });
  expect(provider.providerId).toBe('ollama');
  expect(provider.modelId).toBe('synthetic-model');
  const draft = await provider.generate({ subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2', topic: 'garden patterns' });
  expect(draft).toMatchObject({ title: validDraft.title, steps: validDraft.steps });
  expect(requestBody).toContain('garden patterns');
  expect(requestBody).toContain('"stream":false');
  expect(requestBody).toContain('"format"');
});

test('rejects remote provider URLs and malformed model output', async () => {
  expect(() => new OllamaLessonDraftProvider('synthetic-model', 'https://example.test')).toThrow('OLLAMA_MUST_BE_LOCAL');
  const provider = new OllamaLessonDraftProvider('synthetic-model', 'http://localhost:11434', async () =>
    new Response(JSON.stringify({ response: JSON.stringify({ ...validDraft, curriculumCompliance: 'official' }) }), { status: 200 }));
  await expect(provider.generate({ subject: 'Science', strand: 'Inquiry', learningLevel: 'Year 2', topic: 'local habitat' }))
    .rejects.toMatchObject({ code: 'AI_INVALID_OUTPUT' } satisfies Partial<LessonError>);
});

test('rejects unsupported curriculum-compliance claims in generated content', async () => {
  const provider = new OllamaLessonDraftProvider('synthetic-model', 'http://localhost:11434', async () =>
    new Response(JSON.stringify({ response: JSON.stringify({ ...validDraft, description: 'This lesson is NESA-approved.' }) }), { status: 200 }));
  await expect(provider.generate({ subject: 'Science', strand: 'Inquiry', learningLevel: 'Year 2', topic: 'local habitat' }))
    .rejects.toMatchObject({ code: 'AI_INVALID_OUTPUT' });
});
