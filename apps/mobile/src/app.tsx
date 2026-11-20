import { useCallback, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { HomeLearnPrototype } from './prototype';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';
const learnerId = 'learner-a';
const familyId = 'local-demo';
const assessmentJudgements = ['emerging', 'developing', 'demonstrated', 'not-assessed'] as const;
type Judgement = typeof assessmentJudgements[number];
type Plan = { id: string; title: string; startsOn: string; endsOn: string };
type Schedule = { startsAt: string; endsAt: string; timeZone: string };
type Activity = { id: string; planId: string; title: string; learnerIds: string[]; schedule?: Schedule; scheduleHistory?: readonly unknown[] };
type Experience = { id: string; title: string; happenedAt: string };
type LearningRecord = { id: string; experienceId: string; learnerId: string; completed: boolean; observation?: string; curriculumVersionId?: string };
type Assessment = { id: string; learnerRecordId: string; outcomeId: string; assessedAt: string; judgement: Judgement; rationale?: string };

async function request<T>(path: string, body?: unknown, method = 'POST'): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...(body === undefined ? {} : { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

const id = () => `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const localTime = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
async function loadAssessments(records: readonly LearningRecord[]): Promise<Assessment[]> {
  const results: Assessment[] = [];
  const batchSize = 8;
  for (let offset = 0; offset < records.length; offset += batchSize) {
    const batch = records.slice(offset, offset + batchSize);
    const assessments = await Promise.all(batch.map(record => request<Assessment[]>(`/api/v1/learner-records/${encodeURIComponent(record.id)}/assessments`, undefined, 'GET')));
    results.push(...assessments.flat());
  }
  return results;
}

export default function App() {
  const [showLocalApi, setShowLocalApi] = useState(false);
  return showLocalApi
    ? <LocalApiWorkflow onBackToPrototype={() => setShowLocalApi(false)} />
    : <HomeLearnPrototype onOpenApi={() => setShowLocalApi(true)} />;
}

function LocalApiWorkflow({ onBackToPrototype }: { readonly onBackToPrototype: () => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [planTitle, setPlanTitle] = useState('Learning this week');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityLearners, setActivityLearners] = useState(learnerId);
  const [isScheduled, setIsScheduled] = useState(false);
  const [startsAt, setStartsAt] = useState(() => localTime(9));
  const [endsAt, setEndsAt] = useState(() => localTime(10));
  const [timeZone, setTimeZone] = useState('Australia/Sydney');
  const [editingActivityId, setEditingActivityId] = useState<string>();
  const [experienceTitle, setExperienceTitle] = useState('Unplanned learning');
  const [recordLearnerId, setRecordLearnerId] = useState(learnerId);
  const [recordObservation, setRecordObservation] = useState('');
  const [curriculumVersionId, setCurriculumVersionId] = useState('');
  const [observationDrafts, setObservationDrafts] = useState<Record<string, string>>({});
  const [outcomeDrafts, setOutcomeDrafts] = useState<Record<string, string>>({});
  const [judgementDrafts, setJudgementDrafts] = useState<Record<string, Judgement>>({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [nextPlans, nextActivities, nextExperiences, nextRecords] = await Promise.all([
        request<Plan[]>('/api/v1/plans'),
        request<Activity[]>('/api/v1/activities'),
        request<Experience[]>('/api/v1/learning-experiences'),
        request<LearningRecord[]>('/api/v1/learner-records'),
      ]);
      const nextAssessments = await loadAssessments(nextRecords);
      setPlans(nextPlans);
      setActivities(nextActivities);
      setExperiences(nextExperiences);
      setRecords(nextRecords);
      setAssessments(nextAssessments);
      setSelectedPlanId(current => current || nextPlans[0]?.id || '');
      setMessage('');
    } catch {
      setMessage('Start the local HomeLearn API to load and save synthetic demo data.');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void refresh(); }, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const withBusy = async (action: () => Promise<void>, failure: string) => {
    setBusy(true);
    try { await action(); } catch { setMessage(failure); } finally { setBusy(false); }
  };

  const createPlan = () => withBusy(async () => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const plan = await request<Plan>('/api/v1/plans', {
      id: id(), familyId, title: planTitle.trim() || 'Learning this week',
      startsOn: start.toISOString().slice(0, 10), endsOn: end.toISOString().slice(0, 10), status: 'active',
    });
    setSelectedPlanId(plan.id);
    await refresh();
  }, 'Could not save the plan. Check the local API.');

  const resetActivityForm = () => {
    setEditingActivityId(undefined);
    setActivityTitle('');
    setActivityLearners(learnerId);
    setIsScheduled(false);
  };

  const editActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setSelectedPlanId(activity.planId);
    setActivityTitle(activity.title);
    setActivityLearners(activity.learnerIds.join(', '));
    setIsScheduled(activity.schedule !== undefined);
    if (activity.schedule !== undefined) {
      setStartsAt(activity.schedule.startsAt);
      setEndsAt(activity.schedule.endsAt);
      setTimeZone(activity.schedule.timeZone);
    }
  };

  const saveActivity = () => withBusy(async () => {
    const learners = activityLearners.split(',').map(value => value.trim()).filter(Boolean);
    const schedule = isScheduled ? { startsAt, endsAt, timeZone } : undefined;
    if (editingActivityId === undefined) {
      if (selectedPlanId === '') throw new Error('Choose a plan first.');
      await request('/api/v1/activities', {
        id: id(), familyId, planId: selectedPlanId, title: activityTitle.trim(), learnerIds: learners,
        ...(schedule === undefined ? {} : { schedule }),
      });
    } else {
      await request(`/api/v1/activities/${encodeURIComponent(editingActivityId)}`, {
        title: activityTitle.trim(), learnerIds: learners, schedule: schedule ?? null,
        changedAt: new Date().toISOString(), changedBy: 'adult-local',
      }, 'PATCH');
    }
    resetActivityForm();
    await refresh();
  }, 'Could not save the activity. Check the title, learner IDs, schedule, and local API.');

  const recordLearning = () => withBusy(async () => {
    if (experienceTitle.trim() === '' || recordLearnerId.trim() === '') throw new Error('An experience title and learner ID are required.');
    const experienceId = id();
    await request('/api/v1/learning-experiences', {
      id: experienceId, familyId, happenedAt: new Date().toISOString(), title: experienceTitle.trim(),
    });
    await request('/api/v1/learner-records', {
      id: id(), experienceId, learnerId: recordLearnerId.trim(), completed: false,
      ...(recordObservation.trim() === '' ? {} : { observation: recordObservation.trim() }),
      ...(curriculumVersionId.trim() === '' ? {} : { curriculumVersionId: curriculumVersionId.trim(), configurationSnapshot: { sourceKind: 'family-defined' } }),
    });
    setRecordObservation('');
    await refresh();
  }, 'Could not save the learning record. Check the learner ID and local API.');

  const saveObservation = (record: LearningRecord) => withBusy(async () => {
    const observation = observationDrafts[record.id] ?? record.observation ?? '';
    await request(`/api/v1/learner-records/${encodeURIComponent(record.id)}`, { observation: observation.trim() || null }, 'PATCH');
    await refresh();
  }, 'Could not update the observation. Check the local API.');

  const saveAssessment = (record: LearningRecord) => withBusy(async () => {
    const outcomeId = (outcomeDrafts[record.id] ?? '').trim();
    if (outcomeId === '') throw new Error('Enter a parent-defined goal reference.');
    await request(`/api/v1/learner-records/${encodeURIComponent(record.id)}/assessments`, {
      id: id(), learnerRecordId: record.id, outcomeId, assessedAt: new Date().toISOString(),
      assessedBy: 'adult-local', judgement: judgementDrafts[record.id] ?? 'developing',
    });
    await refresh();
  }, 'Could not record the assessment. Add a curriculum version to the learning record first.');

  const cycleJudgement = (recordId: string) => {
    setJudgementDrafts(current => {
      const currentJudgement = current[recordId] ?? 'developing';
      const index = assessmentJudgements.indexOf(currentJudgement);
      return { ...current, [recordId]: assessmentJudgements[(index + 1) % assessmentJudgements.length] ?? 'emerging' };
    });
  };

  return <ScrollView contentContainerStyle={styles.page}><View style={styles.content}>
    <Button title="← Back to product prototype" onPress={onBackToPrototype} />
    <Text accessibilityRole="header" style={styles.title}>HomeLearn</Text>
    <Text style={styles.body}>Plan learning and record what happens. Local demo uses synthetic family and learner IDs only.</Text>
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}

    <Text accessibilityRole="header" style={styles.heading}>Weekly plans</Text>
    <TextInput accessibilityLabel="Plan title" style={styles.input} value={planTitle} onChangeText={setPlanTitle} />
    <Button title="Create a weekly plan" disabled={busy} onPress={() => void createPlan()} />
    {plans.map(plan => <View key={plan.id} style={styles.row}>
      <Text style={styles.item}>{plan.title} · {plan.startsOn}–{plan.endsOn}</Text>
      <Button title={selectedPlanId === plan.id ? 'Selected plan' : 'Use this plan'} onPress={() => setSelectedPlanId(plan.id)} />
    </View>)}

    <Text accessibilityRole="header" style={styles.heading}>Activities</Text>
    <TextInput accessibilityLabel="Activity title" style={styles.input} placeholder="Activity title" value={activityTitle} onChangeText={setActivityTitle} />
    <TextInput accessibilityLabel="Learner IDs" style={styles.input} placeholder="Learner IDs, comma separated" value={activityLearners} onChangeText={setActivityLearners} />
    <View style={styles.row}><Text style={styles.body}>Schedule this activity</Text><Switch accessibilityLabel="Schedule this activity" value={isScheduled} onValueChange={setIsScheduled} /></View>
    {isScheduled ? <>
      <TextInput accessibilityLabel="Starts at" style={styles.input} value={startsAt} onChangeText={setStartsAt} />
      <TextInput accessibilityLabel="Ends at" style={styles.input} value={endsAt} onChangeText={setEndsAt} />
      <TextInput accessibilityLabel="Time zone" style={styles.input} value={timeZone} onChangeText={setTimeZone} />
    </> : null}
    <Button title={editingActivityId === undefined ? 'Create activity' : 'Save activity changes'} disabled={busy} onPress={() => void saveActivity()} />
    {editingActivityId !== undefined ? <Button title="Cancel editing" disabled={busy} onPress={resetActivityForm} /> : null}
    {activities.map(activity => <View key={activity.id} style={styles.card}>
      <Text style={styles.item}>{activity.title} · {activity.learnerIds.join(', ')} · {activity.schedule === undefined ? 'flexible' : 'scheduled'}</Text>
      {activity.scheduleHistory?.length ? <Text style={styles.body}>Schedule changes: {activity.scheduleHistory.length}</Text> : null}
      <Button title="Edit activity" disabled={busy} onPress={() => editActivity(activity)} />
    </View>)}

    <Text accessibilityRole="header" style={styles.heading}>Learning records</Text>
    <TextInput accessibilityLabel="Experience title" style={styles.input} value={experienceTitle} onChangeText={setExperienceTitle} />
    <TextInput accessibilityLabel="Learner ID" style={styles.input} value={recordLearnerId} onChangeText={setRecordLearnerId} />
    <TextInput accessibilityLabel="Observation" style={[styles.input, styles.multiline]} multiline value={recordObservation} onChangeText={setRecordObservation} placeholder="Parent observation (optional)" />
    <TextInput accessibilityLabel="Curriculum version ID" style={styles.input} value={curriculumVersionId} onChangeText={setCurriculumVersionId} placeholder="Parent-defined curriculum version (optional)" />
    <Button title="Record unplanned learning" disabled={busy} onPress={() => void recordLearning()} />
    {experiences.map(experience => <View key={experience.id} style={styles.card}>
      <Text style={styles.item}>{experience.title} · {new Date(experience.happenedAt).toLocaleDateString()}</Text>
      {records.filter(record => record.experienceId === experience.id).map(record => <View key={record.id} style={styles.record}>
        <Text style={styles.body}>{record.learnerId} · {record.completed ? 'Activity completed' : 'Learning recorded; activity completion not marked'}</Text>
        <TextInput accessibilityLabel={`Observation for ${record.learnerId}`} style={[styles.input, styles.multiline]} multiline value={observationDrafts[record.id] ?? record.observation ?? ''} onChangeText={value => setObservationDrafts(current => ({ ...current, [record.id]: value }))} placeholder="Parent observation" />
        <Button title="Save observation" disabled={busy} onPress={() => void saveObservation(record)} />
        {record.curriculumVersionId ? <>
          <Text style={styles.body}>Curriculum version: {record.curriculumVersionId}</Text>
          <TextInput accessibilityLabel={`Goal reference for ${record.learnerId}`} style={styles.input} value={outcomeDrafts[record.id] ?? ''} onChangeText={value => setOutcomeDrafts(current => ({ ...current, [record.id]: value }))} placeholder="Parent-defined goal reference" />
          <Button title={`Judgement: ${judgementDrafts[record.id] ?? 'developing'} (change)`} disabled={busy} onPress={() => cycleJudgement(record.id)} />
          <Button title="Record outcome assessment" disabled={busy} onPress={() => void saveAssessment(record)} />
          {assessments.filter(assessment => assessment.learnerRecordId === record.id).map(assessment => <Text key={assessment.id} style={styles.body}>{assessment.outcomeId}: {assessment.judgement} · {new Date(assessment.assessedAt).toLocaleDateString()}</Text>)}
        </> : <Text style={styles.body}>Add a parent-defined curriculum version when recording to enable outcome assessment.</Text>}
      </View>)}
    </View>)}
    <Button title="Refresh" disabled={busy} onPress={() => void refresh()} />
  </View></ScrollView>;
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, padding: 24, backgroundColor: '#f7f5ef' },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 14 },
  title: { fontSize: 36, fontWeight: '700', color: '#183e36' },
  heading: { fontSize: 24, fontWeight: '600', color: '#183e36', marginTop: 12 },
  body: { fontSize: 16, lineHeight: 24, color: '#253b36' },
  item: { flex: 1, fontSize: 16, color: '#183e36', paddingVertical: 8 },
  input: { borderWidth: 1, borderColor: '#87958f', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  message: { color: '#9a3412' },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#fff', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  record: { borderTopWidth: 1, borderTopColor: '#d2d8d4', paddingTop: 12, gap: 8 },
});
