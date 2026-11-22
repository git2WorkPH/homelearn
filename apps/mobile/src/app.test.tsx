import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from './app';

test('shows an interactive product prototype with lessons, planning, journal, and progress views', async () => {
  const result = await render(<App />);
  expect(result.getByText('homelearn')).toBeTruthy();
  expect(result.getByText('PROTOTYPE')).toBeTruthy();
  expect(result.getByText('Learning, your way.')).toBeTruthy();
  await fireEvent.press(result.getByText('Lessons'));
  expect(result.getByText('Create a family lesson')).toBeTruthy();
  await fireEvent.press(result.getByText('Home'));

  await fireEvent.press(result.getByText('Independent'));
  expect(result.getByText('Your plans are ready when you are. Leave space for curiosity.')).toBeTruthy();
  await fireEvent.press(result.getByText('Planner'));
  expect(result.getByText('Weekly plan')).toBeTruthy();
  await fireEvent.press(result.getByText('Lessons'));
  expect(result.getByText('Browse Kindergarten through Year 12, across the learning areas your family chooses.')).toBeTruthy();
  await fireEvent.press(result.getByText('Yr 8'));
  expect(result.getAllByText('Selected level · Year 8').length).toBeGreaterThan(0);
  await fireEvent.press(result.getByText('Review coverage'));
  expect(result.getByText('Coverage for Year 8')).toBeTruthy();
  expect(result.getByText('Illustrative tracker only. No sample lesson has been editorially reviewed and no level is marked complete.')).toBeTruthy();
  await fireEvent.press(result.getByText('Browse lessons'));
  await fireEvent.press(result.getByText('Pattern detectives'));
  expect(result.getByText('LEARNING GOAL')).toBeTruthy();
  expect(result.getByText('Household objects, sounds, or movement')).toBeTruthy();
  expect(result.getByText('Original HomeLearn prototype idea · Demo 0.2 · Illustrative · not reviewed')).toBeTruthy();
  expect(result.getByText('Prototype idea only. Jurisdiction-specific syllabus references are deferred; this content has not been reviewed for K–12 coverage.')).toBeTruthy();
  await fireEvent.press(result.getByText('Add lesson to this week'));
  expect(result.getByText('Weekly plan')).toBeTruthy();
  expect(result.getByText('Pattern detectives')).toBeTruthy();
  await fireEvent.press(result.getByText('Lessons'));
  await fireEvent.changeText(result.getByLabelText('Search lesson ideas'), 'tiny ecosystem');
  expect(result.getByText('A tiny ecosystem')).toBeTruthy();
  expect(result.queryByText('Pattern detectives')).toBeNull();
  await fireEvent.press(result.getByText('Journal'));
  expect(result.getByText('Learning journal')).toBeTruthy();
  await fireEvent.press(result.getByText('Progress'));
  expect(result.getByText('Learning areas')).toBeTruthy();
  await fireEvent.press(result.getByText('Home'));
  await fireEvent.press(result.getByText('Add an activity'));
  expect(result.getByText('Plan an activity')).toBeTruthy();
  await fireEvent.changeText(result.getByLabelText('Activity idea'), 'Make a weather chart');
  expect(result.getByDisplayValue('Make a weather chart')).toBeTruthy();
  expect(result.getByText('Add to this week')).toBeTruthy();
});

test('connects catalogue lessons and family experiences from either starting point', async () => {
  const result = await render(<App />);
  await fireEvent.press(result.getByText('Lessons'));
  await fireEvent.press(result.getByText('Pattern detectives'));
  await fireEvent.changeText(result.getByLabelText('Family experience example'), 'Bake bread and scale the recipe');
  await fireEvent.press(result.getByText('Plan with family experience'));

  expect(result.getByText('Weekly plan')).toBeTruthy();
  expect(result.getByText('Bake bread and scale the recipe')).toBeTruthy();
  expect(result.getByText('K–12 lesson · Pattern detectives')).toBeTruthy();
  const logActions = result.getAllByText('＋ Log learning');
  const lastLogAction = logActions[logActions.length - 1];
  expect(lastLogAction).toBeTruthy();
  if (lastLogAction === undefined) throw new Error('Expected a log-learning action for the planned family experience.');
  await fireEvent.press(lastLogAction);
  expect(result.getByText('Lesson · Pattern detectives')).toBeTruthy();
  await fireEvent.changeText(result.getByLabelText('Learning observation'), 'Compared ingredient amounts while mixing.');
  await fireEvent.press(result.getByText('Save learning moment'));
  expect(result.getByText('K–12 lesson · Pattern detectives')).toBeTruthy();

  await fireEvent.press(result.getByText('Capture a learning moment'));
  await fireEvent.changeText(result.getByLabelText('Family activity or experience'), 'Museum visit');
  await fireEvent.changeText(result.getByLabelText('Learning observation'), 'Compared the shapes in the exhibit.');
  await fireEvent.press(result.getByText('Choose a lesson to link'));
  await fireEvent.press(result.getByText('Stories in shapes'));
  expect(result.getByText('Lesson · Stories in shapes')).toBeTruthy();
  await fireEvent.press(result.getByText('Save learning moment'));
  expect(result.getByText('K–12 lesson · Stories in shapes')).toBeTruthy();
  expect(result.getByText(/Museum visit/)).toBeTruthy();
});

test('edits an activity and observation, and records an independent outcome assessment', async () => {
  const plan = { id: 'plan-test', title: 'Synthetic week', startsOn: '2026-11-23', endsOn: '2026-11-29' };
  const activity = { id: 'activity-test', planId: plan.id, title: 'Reading', learnerIds: ['learner-test'], schedule: { startsAt: '2026-11-24T01:00:00Z', endsAt: '2026-11-24T02:00:00Z', timeZone: 'Australia/Sydney' }, scheduleHistory: [] };
  const experience = { id: 'experience-test', title: 'Garden study', happenedAt: '2026-11-24T03:00:00Z' };
  const record = { id: 'record-test', experienceId: experience.id, learnerId: 'learner-test', completed: false, observation: 'Initial synthetic observation', curriculumVersionId: 'family-defined:test-v1' };
  const lesson = { id: 'lesson-version-test', lessonKey: 'family-pattern-lesson', familyId: 'local-demo', versionLabel: '1.0', title: 'Family pattern lesson', subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2', learningGoal: 'Notice and describe a pattern.', successCriteria: [], materials: [], steps: ['Find a pattern'], creationMethod: 'manual', createdAt: '2026-11-24T00:00:00.000Z' };
  const requests: { url: string; method: string; body?: string }[] = [];
  let savedLessonVersionId = lesson.id;
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    requests.push({ url, method, ...(typeof init?.body === 'string' ? { body: init.body } : {}) });
    let response: unknown = [];
    if (url.endsWith('/api/v1/plans')) response = [plan];
    else if (url.endsWith('/api/v1/activities')) response = [activity];
    else if (url.includes('/api/v1/lesson-versions?familyId=')) response = [{ ...lesson, id: savedLessonVersionId }];
    else if (url.endsWith('/api/v1/learning-experiences')) response = [experience];
    else if (url.endsWith('/api/v1/learner-records')) response = [record];
    else if (url.endsWith(`/api/v1/learner-records/${record.id}/assessments`)) response = [];
    else if (url.endsWith('/api/v1/lesson-versions') && method === 'POST') {
      const payload = init?.body ? JSON.parse(String(init.body)) as { id: string } : { id: lesson.id };
      savedLessonVersionId = payload.id;
      response = { ...lesson, ...payload };
    }
    else if (method === 'POST' || method === 'PATCH') response = { ...record, ...(init?.body ? JSON.parse(String(init.body)) as object : {}) };
    return { ok: true, json: async () => response } as Response;
  });
  const result = await render(<App />);
  expect(result.getByText('PROTOTYPE')).toBeTruthy();
  await fireEvent.press(result.getByText('Lessons'));
  await fireEvent.press(result.getByText('Create a family lesson'));
  expect(result.getByText('HomeLearn')).toBeTruthy();
  expect(result.getByText('Weekly plans')).toBeTruthy();
  expect(result.getByText('Activities')).toBeTruthy();
  expect(result.getByText('Record unplanned learning')).toBeTruthy();
  await fireEvent.changeText(result.getByLabelText('Lesson title'), 'Family pattern lesson');
  await fireEvent.changeText(result.getByLabelText('Lesson strand'), 'Patterns');
  await fireEvent.changeText(result.getByLabelText('Learning goal'), 'Notice and describe a pattern.');
  await fireEvent.changeText(result.getByLabelText('Lesson steps'), 'Find a pattern');
  await fireEvent.press(result.getByText('Save family lesson'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/lesson-versions') && request.method === 'POST' && JSON.parse(request.body ?? '{}').creationMethod === 'manual')).toBe(true));
  await waitFor(() => expect(result.getByText('Reading · learner-test · scheduled')).toBeTruthy());

  await fireEvent.press(result.getByText('Edit activity'));
  await fireEvent.changeText(result.getByLabelText('Activity title'), 'Updated reading');
  await fireEvent(result.getByLabelText('Schedule this activity'), 'valueChange', false);
  await fireEvent.press(result.getByText('Save activity changes'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/activities/${activity.id}`) && request.method === 'PATCH' && JSON.parse(request.body ?? '{}').title === 'Updated reading' && JSON.parse(request.body ?? '{}').schedule === null && JSON.parse(request.body ?? '{}').learnerIds[0] === 'learner-test')).toBe(true));

  await fireEvent.press(result.getByText('Use in planned activity'));
  await fireEvent.changeText(result.getByLabelText('Activity title'), 'Flexible science project');
  await fireEvent.changeText(result.getByLabelText('Learner IDs'), 'learner-test, learner-sibling');
  await fireEvent.press(result.getByText('Create activity'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/activities') && request.method === 'POST' && JSON.parse(request.body ?? '{}').learnerIds.join(',') === 'learner-test,learner-sibling' && JSON.parse(request.body ?? '{}').schedule === undefined && JSON.parse(request.body ?? '{}').lessonVersionId === savedLessonVersionId)).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Experience title'), 'Synthetic outdoor study');
  await fireEvent.changeText(result.getByLabelText('Observation'), 'Noted seed growth');
  await fireEvent.changeText(result.getByLabelText('Curriculum version ID'), 'family-defined:demo-v1');
  await fireEvent.press(result.getByText('Record unplanned learning'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/learner-records') && request.method === 'POST' && JSON.parse(request.body ?? '{}').completed === false && JSON.parse(request.body ?? '{}').curriculumVersionId === 'family-defined:demo-v1' && JSON.parse(request.body ?? '{}').lessonVersionId === savedLessonVersionId)).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Observation for learner-test'), 'Revised synthetic observation');
  await fireEvent.press(result.getByText('Save observation'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/learner-records/${record.id}`) && JSON.parse(request.body ?? '{}').observation === 'Revised synthetic observation')).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Goal reference for learner-test'), 'family-defined:test-goal');
  await fireEvent.press(result.getByText('Record outcome assessment'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/learner-records/${record.id}/assessments`) && request.method === 'POST' && JSON.parse(request.body ?? '{}').judgement === 'developing')).toBe(true));
  fetchMock.mockRestore();
});

test('requires parent review before saving an AI generated lesson draft', async () => {
  const requests: { url: string; method: string; body?: string }[] = [];
  const draft = {
    title: 'Garden patterns', subject: 'Mathematics', strand: 'Patterns', learningLevel: 'Year 2',
    learningGoal: 'Describe one repeating pattern.', successCriteria: ['Explain what repeats'],
    description: 'Explore a pattern in the garden.', materials: ['Paper'],
    steps: ['Find a pattern', 'Describe the repeating part'], adaptation: 'Use objects at home.', estimatedMinutes: 20,
    creationMethod: 'ai-generated', aiProvider: 'ollama', aiModel: 'synthetic-model', requiresParentReview: true,
  };
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    requests.push({ url, method, ...(typeof init?.body === 'string' ? { body: init.body } : {}) });
    let response: unknown = [];
    if (url.endsWith('/api/v1/lesson-drafts')) response = draft;
    else if (url.endsWith('/api/v1/lesson-versions') && method === 'POST') response = { ...draft, ...(init?.body ? JSON.parse(String(init.body)) as object : {}) };
    return { ok: true, json: async () => response } as Response;
  });
  try {
    const result = await render(<App />);
    await fireEvent.press(result.getByText('Local API ↗'));
    await fireEvent.changeText(result.getByLabelText('Lesson strand'), 'Patterns');
    await fireEvent.changeText(result.getByLabelText('Learning goal'), 'Garden patterns');
    await fireEvent.press(result.getByText('Draft with local AI'));
    await waitFor(() => expect(result.getByText('Approve and save lesson version')).toBeTruthy());
    expect(requests.some(request => request.url.endsWith('/api/v1/lesson-versions') && request.method === 'POST')).toBe(false);
    await fireEvent(result.getByLabelText('I reviewed and approve this AI draft'), 'valueChange', true);
    await fireEvent.changeText(result.getByLabelText('Lesson title'), 'Edited garden patterns');
    expect(requests.some(request => request.url.endsWith('/api/v1/lesson-versions') && request.method === 'POST')).toBe(false);
    await fireEvent(result.getByLabelText('I reviewed and approve this AI draft'), 'valueChange', true);
    await fireEvent.press(result.getByText('Approve and save lesson version'));
    await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/lesson-versions') && request.method === 'POST' && JSON.parse(request.body ?? '{}').creationMethod === 'ai-generated' && JSON.parse(request.body ?? '{}').parentApproved === true && JSON.parse(request.body ?? '{}').aiProvider === 'ollama' && JSON.parse(request.body ?? '{}').aiModel === 'synthetic-model')).toBe(true));
  } finally {
    fetchMock.mockRestore();
  }
});
