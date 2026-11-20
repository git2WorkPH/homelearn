import { fireEvent, render, waitFor } from '@testing-library/react-native';
import App from './app';

test('shows an interactive product prototype with lessons, planning, journal, and progress views', async () => {
  const result = await render(<App />);
  expect(result.getByText('homelearn')).toBeTruthy();
  expect(result.getByText('PROTOTYPE')).toBeTruthy();
  expect(result.getByText('Learning, your way.')).toBeTruthy();

  await fireEvent.press(result.getByText('Independent'));
  expect(result.getByText('Your plans are ready when you are. Leave space for curiosity.')).toBeTruthy();
  await fireEvent.press(result.getByText('Planner'));
  expect(result.getByText('Weekly plan')).toBeTruthy();
  await fireEvent.press(result.getByText('Lessons'));
  expect(result.getByText('Explore ideas from kindergarten through Year 12, across the subjects your family chooses.')).toBeTruthy();
  await fireEvent.press(result.getByText('Pattern detectives'));
  expect(result.getByText('Original sample idea. Adapt it to your learner; no official syllabus mapping is claimed.')).toBeTruthy();
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

test('edits an activity and observation, and records an independent outcome assessment', async () => {
  const plan = { id: 'plan-test', title: 'Synthetic week', startsOn: '2026-11-23', endsOn: '2026-11-29' };
  const activity = { id: 'activity-test', planId: plan.id, title: 'Reading', learnerIds: ['learner-test'], schedule: { startsAt: '2026-11-24T01:00:00Z', endsAt: '2026-11-24T02:00:00Z', timeZone: 'Australia/Sydney' }, scheduleHistory: [] };
  const experience = { id: 'experience-test', title: 'Garden study', happenedAt: '2026-11-24T03:00:00Z' };
  const record = { id: 'record-test', experienceId: experience.id, learnerId: 'learner-test', completed: false, observation: 'Initial synthetic observation', curriculumVersionId: 'family-defined:test-v1' };
  const requests: { url: string; method: string; body?: string }[] = [];
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    requests.push({ url, method, ...(typeof init?.body === 'string' ? { body: init.body } : {}) });
    let response: unknown = [];
    if (url.endsWith('/api/v1/plans')) response = [plan];
    else if (url.endsWith('/api/v1/activities')) response = [activity];
    else if (url.endsWith('/api/v1/learning-experiences')) response = [experience];
    else if (url.endsWith('/api/v1/learner-records')) response = [record];
    else if (url.endsWith(`/api/v1/learner-records/${record.id}/assessments`)) response = [];
    else if (method === 'POST' || method === 'PATCH') response = { ...record, ...(init?.body ? JSON.parse(String(init.body)) as object : {}) };
    return { ok: true, json: async () => response } as Response;
  });
  const result = await render(<App />);
  expect(result.getByText('PROTOTYPE')).toBeTruthy();
  await fireEvent.press(result.getByText('Local API ↗'));
  expect(result.getByText('HomeLearn')).toBeTruthy();
  expect(result.getByText('Weekly plans')).toBeTruthy();
  expect(result.getByText('Activities')).toBeTruthy();
  expect(result.getByText('Record unplanned learning')).toBeTruthy();
  await waitFor(() => expect(result.getByText('Reading · learner-test · scheduled')).toBeTruthy());

  await fireEvent.press(result.getByText('Edit activity'));
  await fireEvent.changeText(result.getByLabelText('Activity title'), 'Updated reading');
  await fireEvent(result.getByLabelText('Schedule this activity'), 'valueChange', false);
  await fireEvent.press(result.getByText('Save activity changes'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/activities/${activity.id}`) && request.method === 'PATCH' && JSON.parse(request.body ?? '{}').title === 'Updated reading' && JSON.parse(request.body ?? '{}').schedule === null && JSON.parse(request.body ?? '{}').learnerIds[0] === 'learner-test')).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Activity title'), 'Flexible science project');
  await fireEvent.changeText(result.getByLabelText('Learner IDs'), 'learner-test, learner-sibling');
  await fireEvent.press(result.getByText('Create activity'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/activities') && request.method === 'POST' && JSON.parse(request.body ?? '{}').learnerIds.join(',') === 'learner-test,learner-sibling' && JSON.parse(request.body ?? '{}').schedule === undefined)).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Experience title'), 'Synthetic outdoor study');
  await fireEvent.changeText(result.getByLabelText('Observation'), 'Noted seed growth');
  await fireEvent.changeText(result.getByLabelText('Curriculum version ID'), 'family-defined:demo-v1');
  await fireEvent.press(result.getByText('Record unplanned learning'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith('/api/v1/learner-records') && request.method === 'POST' && JSON.parse(request.body ?? '{}').completed === false && JSON.parse(request.body ?? '{}').curriculumVersionId === 'family-defined:demo-v1')).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Observation for learner-test'), 'Revised synthetic observation');
  await fireEvent.press(result.getByText('Save observation'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/learner-records/${record.id}`) && JSON.parse(request.body ?? '{}').observation === 'Revised synthetic observation')).toBe(true));

  await fireEvent.changeText(result.getByLabelText('Goal reference for learner-test'), 'family-defined:test-goal');
  await fireEvent.press(result.getByText('Record outcome assessment'));
  await waitFor(() => expect(requests.some(request => request.url.endsWith(`/api/v1/learner-records/${record.id}/assessments`) && request.method === 'POST' && JSON.parse(request.body ?? '{}').judgement === 'developing')).toBe(true));
  fetchMock.mockRestore();
});
