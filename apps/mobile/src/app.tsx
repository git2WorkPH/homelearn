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
type Activity = { id: string; planId: string; title: string; learnerIds: string[]; lessonVersionId?: string; schedule?: Schedule; scheduleHistory?: readonly unknown[] };
type Experience = { id: string; title: string; happenedAt: string; activityId?: string };
type LessonVersion = { id: string; lessonKey: string; familyId: string; versionLabel: string; title: string; subject: string; strand: string; learningLevel: string; learningGoal: string; successCriteria: string[]; description?: string; materials: string[]; steps: string[]; adaptation?: string; estimatedMinutes?: number; creationMethod: 'manual' | 'ai-generated'; aiProvider?: string; aiModel?: string; parentApprovedAt?: string; createdAt: string };
type LearningRecord = { id: string; experienceId: string; learnerId: string; completed: boolean; observation?: string; lessonVersionId?: string; curriculumVersionId?: string };
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
  const [lessonVersions, setLessonVersions] = useState<LessonVersion[]>([]);
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
  const [activityLessonVersionId, setActivityLessonVersionId] = useState('');
  const [recordActivityId, setRecordActivityId] = useState('');
  const [recordLessonVersionId, setRecordLessonVersionId] = useState<string | null | undefined>(undefined);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSubject, setLessonSubject] = useState('English');
  const [lessonStrand, setLessonStrand] = useState('');
  const [lessonLevel, setLessonLevel] = useState('Kindergarten');
  const [lessonGoal, setLessonGoal] = useState('');
  const [lessonCriteria, setLessonCriteria] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonMaterials, setLessonMaterials] = useState('');
  const [lessonSteps, setLessonSteps] = useState('');
  const [lessonAdaptation, setLessonAdaptation] = useState('');
  const [lessonMinutes, setLessonMinutes] = useState('30');
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [hasReviewedAiDraft, setHasReviewedAiDraft] = useState(false);
  const [lessonAiProvider, setLessonAiProvider] = useState('');
  const [lessonAiModel, setLessonAiModel] = useState('');
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
      const [nextPlans, nextActivities, nextExperiences, nextRecords, nextLessons] = await Promise.all([
        request<Plan[]>('/api/v1/plans'),
        request<Activity[]>('/api/v1/activities'),
        request<Experience[]>('/api/v1/learning-experiences'),
        request<LearningRecord[]>('/api/v1/learner-records'),
        request<LessonVersion[]>(`/api/v1/lesson-versions?familyId=${encodeURIComponent(familyId)}`, undefined, 'GET'),
      ]);
      const nextAssessments = await loadAssessments(nextRecords);
      setPlans(nextPlans);
      setActivities(nextActivities);
      setExperiences(nextExperiences);
      setRecords(nextRecords);
      setLessonVersions(nextLessons);
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
    setActivityLessonVersionId('');
    setIsScheduled(false);
  };

  const editActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setSelectedPlanId(activity.planId);
    setActivityTitle(activity.title);
    setActivityLearners(activity.learnerIds.join(', '));
    setActivityLessonVersionId(activity.lessonVersionId ?? '');
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
        ...(activityLessonVersionId === '' ? {} : { lessonVersionId: activityLessonVersionId }),
      });
    } else {
      await request(`/api/v1/activities/${encodeURIComponent(editingActivityId)}`, {
        title: activityTitle.trim(), learnerIds: learners, schedule: schedule ?? null,
        lessonVersionId: activityLessonVersionId || null,
        changedAt: new Date().toISOString(), changedBy: 'adult-local',
      }, 'PATCH');
    }
    resetActivityForm();
    await refresh();
  }, 'Could not save the activity. Check the title, learner IDs, schedule, and local API.');

  const recordLearning = () => withBusy(async () => {
    if (experienceTitle.trim() === '' || recordLearnerId.trim() === '') throw new Error('An experience title and learner ID are required.');
    const experienceId = id();
    const selectedActivity = activities.find(activity => activity.id === recordActivityId);
    const linkedLessonVersionId = recordLessonVersionId === null ? undefined : recordLessonVersionId ?? selectedActivity?.lessonVersionId;
    await request('/api/v1/learning-experiences', {
      id: experienceId, familyId, happenedAt: new Date().toISOString(), title: experienceTitle.trim(),
      ...(selectedActivity === undefined ? {} : { activityId: selectedActivity.id }),
    });
    await request('/api/v1/learner-records', {
      id: id(), experienceId, learnerId: recordLearnerId.trim(), completed: false,
      ...(linkedLessonVersionId === undefined ? {} : { lessonVersionId: linkedLessonVersionId }),
      ...(recordObservation.trim() === '' ? {} : { observation: recordObservation.trim() }),
      ...(curriculumVersionId.trim() === '' ? {} : { curriculumVersionId: curriculumVersionId.trim(), configurationSnapshot: { sourceKind: 'family-defined' } }),
    });
    setRecordObservation('');
    setRecordActivityId('');
    setRecordLessonVersionId(undefined);
    await refresh();
  }, 'Could not save the learning record. Check the learner ID and local API.');

  const saveLessonVersion = () => withBusy(async () => {
    if (lessonTitle.trim() === '' || lessonStrand.trim() === '' || lessonGoal.trim() === '') throw new Error('Add a title, strand, and learning goal.');
    if (isAiDraft && !hasReviewedAiDraft) throw new Error('Review and approve the AI draft before saving it.');
    if (isAiDraft && (lessonAiProvider === '' || lessonAiModel === '')) throw new Error('AI provider details are missing. Generate the draft again.');
    const lessonId = id();
    const saved = await request<LessonVersion>('/api/v1/lesson-versions', {
      id: lessonId, lessonKey: lessonId, familyId, versionLabel: '1.0', title: lessonTitle.trim(),
      subject: lessonSubject.trim(), strand: lessonStrand.trim(), learningLevel: lessonLevel.trim(),
      learningGoal: lessonGoal.trim(), successCriteria: lessonCriteria.split('\n').map(value => value.trim()).filter(Boolean),
      ...(lessonDescription.trim() === '' ? {} : { description: lessonDescription.trim() }),
      materials: lessonMaterials.split('\n').map(value => value.trim()).filter(Boolean),
      steps: lessonSteps.split('\n').map(value => value.trim()).filter(Boolean),
      ...(lessonAdaptation.trim() === '' ? {} : { adaptation: lessonAdaptation.trim() }),
      ...(lessonMinutes.trim() === '' ? {} : { estimatedMinutes: Number(lessonMinutes) }),
      creationMethod: isAiDraft ? 'ai-generated' : 'manual',
      ...(isAiDraft ? { parentApproved: true } : {}),
      ...(isAiDraft ? { aiProvider: lessonAiProvider, aiModel: lessonAiModel } : {}),
    });
    setActivityLessonVersionId(saved.id);
    setRecordLessonVersionId(saved.id);
    setLessonTitle(''); setLessonStrand(''); setLessonGoal(''); setLessonCriteria(''); setLessonDescription('');
    setLessonMaterials(''); setLessonSteps(''); setLessonAdaptation(''); setIsAiDraft(false); setHasReviewedAiDraft(false);
    setLessonAiProvider(''); setLessonAiModel('');
    await refresh();
  }, 'Could not save this lesson. Check the required fields and local API.');

  const generateLessonDraft = () => withBusy(async () => {
    if (lessonSubject.trim() === '' || lessonStrand.trim() === '' || lessonLevel.trim() === '' || lessonGoal.trim() === '') throw new Error('Add a topic, subject, strand, and learning level first.');
    const draft = await request<Omit<LessonVersion, 'id' | 'lessonKey' | 'familyId' | 'versionLabel' | 'creationMethod' | 'parentApprovedAt' | 'createdAt'> & { creationMethod: 'ai-generated'; aiProvider: string; aiModel: string; requiresParentReview: true }>('/api/v1/lesson-drafts', {
      subject: lessonSubject.trim(), strand: lessonStrand.trim(), learningLevel: lessonLevel.trim(), topic: lessonGoal.trim(),
    });
    setLessonTitle(draft.title); setLessonGoal(draft.learningGoal); setLessonCriteria(draft.successCriteria.join('\n'));
    setLessonSubject(draft.subject); setLessonStrand(draft.strand); setLessonLevel(draft.learningLevel);
    setLessonDescription(draft.description ?? ''); setLessonMaterials(draft.materials.join('\n')); setLessonSteps(draft.steps.join('\n'));
    setLessonAdaptation(draft.adaptation ?? ''); setLessonMinutes(String(draft.estimatedMinutes ?? 30));
    setLessonAiProvider(draft.aiProvider); setLessonAiModel(draft.aiModel);
    setIsAiDraft(true); setHasReviewedAiDraft(false);
  }, 'Could not generate a local AI draft. Check that Ollama is running and the configured model is available.');

  const editLessonField = (update: (value: string) => void) => (value: string) => {
    update(value);
    if (isAiDraft) setHasReviewedAiDraft(false);
  };
  const selectedRecordActivity = activities.find(activity => activity.id === recordActivityId);
  const visibleRecordLessonId = recordLessonVersionId === null ? undefined : recordLessonVersionId ?? selectedRecordActivity?.lessonVersionId;

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

    <Text accessibilityRole="header" style={styles.heading}>Family lesson workshop</Text>
    <Text style={styles.body}>Write an original lesson for any subject and learning level. Local AI can prepare a draft; review it before saving. Keep learner names and personal details out of AI topics.</Text>
    <TextInput accessibilityLabel="Lesson title" style={styles.input} placeholder="Lesson title" value={lessonTitle} onChangeText={editLessonField(setLessonTitle)} />
    <TextInput accessibilityLabel="Lesson subject" style={styles.input} placeholder="Subject, e.g. Mathematics" value={lessonSubject} onChangeText={editLessonField(setLessonSubject)} />
    <TextInput accessibilityLabel="Lesson strand" style={styles.input} placeholder="Strand or topic area" value={lessonStrand} onChangeText={editLessonField(setLessonStrand)} />
    <TextInput accessibilityLabel="Learning level" style={styles.input} placeholder="Kindergarten, Year 1 … Year 12" value={lessonLevel} onChangeText={editLessonField(setLessonLevel)} />
    <TextInput accessibilityLabel="Learning goal" style={styles.input} placeholder="Topic or learning goal" value={lessonGoal} onChangeText={editLessonField(setLessonGoal)} />
    <TextInput accessibilityLabel="Lesson description" style={styles.input} placeholder="Description (optional)" value={lessonDescription} onChangeText={editLessonField(setLessonDescription)} />
    <TextInput accessibilityLabel="Success criteria" style={[styles.input, styles.multiline]} multiline placeholder="Success criteria, one per line (optional)" value={lessonCriteria} onChangeText={editLessonField(setLessonCriteria)} />
    <TextInput accessibilityLabel="Lesson materials" style={[styles.input, styles.multiline]} multiline placeholder="Materials, one per line" value={lessonMaterials} onChangeText={editLessonField(setLessonMaterials)} />
    <TextInput accessibilityLabel="Lesson steps" style={[styles.input, styles.multiline]} multiline placeholder="Teaching steps, one per line" value={lessonSteps} onChangeText={editLessonField(setLessonSteps)} />
    <TextInput accessibilityLabel="Lesson adaptation" style={[styles.input, styles.multiline]} multiline placeholder="Adaptation or extension (optional)" value={lessonAdaptation} onChangeText={editLessonField(setLessonAdaptation)} />
    <TextInput accessibilityLabel="Estimated minutes" style={styles.input} keyboardType="number-pad" value={lessonMinutes} onChangeText={editLessonField(setLessonMinutes)} />
    <Button title="Draft with local AI" disabled={busy} onPress={() => void generateLessonDraft()} />
    {isAiDraft ? <View style={styles.row}>
      <Text style={styles.body}>AI draft · review all details before saving</Text>
      <Switch accessibilityLabel="I reviewed and approve this AI draft" value={hasReviewedAiDraft} onValueChange={setHasReviewedAiDraft} />
    </View> : null}
    <Button title={isAiDraft ? 'Approve and save lesson version' : 'Save family lesson'} disabled={busy || (isAiDraft && !hasReviewedAiDraft)} onPress={() => void saveLessonVersion()} />
    {lessonVersions.map(lesson => <View key={lesson.id} style={styles.card}>
      <Text style={styles.item}>{lesson.title} · {lesson.subject} · {lesson.learningLevel} · v{lesson.versionLabel}</Text>
      <Text style={styles.body}>{lesson.creationMethod === 'ai-generated' ? `AI-generated · parent approved · ${lesson.aiProvider ?? 'AI'} ${lesson.aiModel ?? ''}` : 'Family-authored'} · {lesson.steps.length} teaching steps</Text>
      <Button title="Use in planned activity" disabled={busy} onPress={() => setActivityLessonVersionId(lesson.id)} />
      <Button title="Link to learning experience" disabled={busy} onPress={() => setRecordLessonVersionId(lesson.id)} />
    </View>)}

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
    <Text style={styles.body}>Lesson version: {lessonVersions.find(lesson => lesson.id === activityLessonVersionId)?.title ?? 'None selected'}</Text>
    <Button title="Clear activity lesson" disabled={busy || activityLessonVersionId === ''} onPress={() => setActivityLessonVersionId('')} />
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
      {activity.lessonVersionId ? <Text style={styles.body}>Lesson: {lessonVersions.find(lesson => lesson.id === activity.lessonVersionId)?.title ?? activity.lessonVersionId}</Text> : null}
      {activity.scheduleHistory?.length ? <Text style={styles.body}>Schedule changes: {activity.scheduleHistory.length}</Text> : null}
      <Button title="Edit activity" disabled={busy} onPress={() => editActivity(activity)} />
      <Button title="Use for learning record" disabled={busy} onPress={() => { setRecordActivityId(activity.id); setExperienceTitle(activity.title); setRecordLessonVersionId(activity.lessonVersionId); }} />
    </View>)}

    <Text accessibilityRole="header" style={styles.heading}>Learning records</Text>
    <TextInput accessibilityLabel="Experience title" style={styles.input} value={experienceTitle} onChangeText={setExperienceTitle} />
    <Text style={styles.body}>Planned activity: {activities.find(activity => activity.id === recordActivityId)?.title ?? 'Unplanned experience'}</Text>
    <Button title="Clear planned activity" disabled={busy || recordActivityId === ''} onPress={() => setRecordActivityId('')} />
    <TextInput accessibilityLabel="Learner ID" style={styles.input} value={recordLearnerId} onChangeText={setRecordLearnerId} />
    <TextInput accessibilityLabel="Observation" style={[styles.input, styles.multiline]} multiline value={recordObservation} onChangeText={setRecordObservation} placeholder="Parent observation (optional)" />
    <TextInput accessibilityLabel="Curriculum version ID" style={styles.input} value={curriculumVersionId} onChangeText={setCurriculumVersionId} placeholder="Parent-defined curriculum version (optional)" />
    <Text style={styles.body}>Lesson version: {lessonVersions.find(lesson => lesson.id === visibleRecordLessonId)?.title ?? 'None selected'}</Text>
    <Button title="Clear experience lesson" disabled={busy || visibleRecordLessonId === undefined} onPress={() => setRecordLessonVersionId(null)} />
    <Button title="Record unplanned learning" disabled={busy} onPress={() => void recordLearning()} />
    {experiences.map(experience => <View key={experience.id} style={styles.card}>
      <Text style={styles.item}>{experience.title} · {new Date(experience.happenedAt).toLocaleDateString()}</Text>
      {experience.activityId ? <Text style={styles.body}>Planned activity: {activities.find(activity => activity.id === experience.activityId)?.title ?? experience.activityId}</Text> : null}
      {records.filter(record => record.experienceId === experience.id).map(record => <View key={record.id} style={styles.record}>
        <Text style={styles.body}>{record.learnerId} · {record.completed ? 'Activity completed' : 'Learning recorded; activity completion not marked'}</Text>
        {record.lessonVersionId ? <Text style={styles.body}>K–12 lesson · {lessonVersions.find(lesson => lesson.id === record.lessonVersionId)?.title ?? record.lessonVersionId}</Text> : null}
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
