import { useCallback, useEffect, useState } from 'react';
import { Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import {
  assessmentJudgements,
  familyId,
  learnerId,
  id,
  loadAssessments,
  localTime,
  request,
  type Activity,
  type Assessment,
  type CatalogueCoverageCell,
  type CatalogueLesson,
  type CatalogueResponse,
  type Experience,
  type Judgement,
  type LearningRecord,
  type LessonVersion,
  type Plan,
} from '../../services/homelearn-api';

export function LocalApiWorkflow({ initialScreen, onBackToPrototype }: { readonly initialScreen: 'workspace' | 'catalogue'; readonly onBackToPrototype: () => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [records, setRecords] = useState<LearningRecord[]>([]);
  const [lessonVersions, setLessonVersions] = useState<LessonVersion[]>([]);
  const [catalogueLessons, setCatalogueLessons] = useState<CatalogueLesson[]>([]);
  const [catalogueCoverage, setCatalogueCoverage] = useState<CatalogueCoverageCell[]>([]);
  const [cataloguePack, setCataloguePack] = useState<CatalogueResponse['pack']>();
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
  const [activityCatalogLessonRef, setActivityCatalogLessonRef] = useState('');
  const [recordActivityId, setRecordActivityId] = useState('');
  const [recordLessonVersionId, setRecordLessonVersionId] = useState<string | null | undefined>(undefined);
  const [recordCatalogLessonRef, setRecordCatalogLessonRef] = useState<string | null | undefined>(undefined);
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
  const [screen, setScreen] = useState<'workspace' | 'catalogue' | 'coverage'>(initialScreen);
  const [catalogueLevel, setCatalogueLevel] = useState('kindergarten');
  const [catalogueArea, setCatalogueArea] = useState('all');
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [selectedCatalogueLessonRef, setSelectedCatalogueLessonRef] = useState('');
  const [catalogueActivityDraft, setCatalogueActivityDraft] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [nextPlans, nextActivities, nextExperiences, nextRecords, nextLessons, nextCatalogue, nextCoverage] = await Promise.all([
        request<Plan[]>('/api/v1/plans'),
        request<Activity[]>('/api/v1/activities'),
        request<Experience[]>('/api/v1/learning-experiences'),
        request<LearningRecord[]>('/api/v1/learner-records'),
        request<LessonVersion[]>(`/api/v1/lesson-versions?familyId=${encodeURIComponent(familyId)}`, undefined, 'GET'),
        request<CatalogueResponse>('/api/v1/catalogue/lessons', undefined, 'GET'),
        request<{ cells: CatalogueCoverageCell[] }>('/api/v1/catalogue/coverage', undefined, 'GET'),
      ]);
      const nextAssessments = await loadAssessments(nextRecords);
      setPlans(nextPlans);
      setActivities(nextActivities);
      setExperiences(nextExperiences);
      setRecords(nextRecords);
      setLessonVersions(nextLessons);
      setCatalogueLessons(nextCatalogue.items);
      setCatalogueCoverage(nextCoverage.cells);
      setCataloguePack(nextCatalogue.pack);
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
    setActivityCatalogLessonRef('');
    setIsScheduled(false);
  };

  const editActivity = (activity: Activity) => {
    setEditingActivityId(activity.id);
    setSelectedPlanId(activity.planId);
    setActivityTitle(activity.title);
    setActivityLearners(activity.learnerIds.join(', '));
    setActivityLessonVersionId(activity.lessonVersionId ?? '');
    setActivityCatalogLessonRef(activity.catalogLessonRef ?? '');
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
        ...(activityCatalogLessonRef === '' ? {} : { catalogLessonRef: activityCatalogLessonRef }),
      });
    } else {
      await request(`/api/v1/activities/${encodeURIComponent(editingActivityId)}`, {
        title: activityTitle.trim(), learnerIds: learners, schedule: schedule ?? null,
        lessonVersionId: activityLessonVersionId || null,
        catalogLessonRef: activityCatalogLessonRef || null,
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
    const linkedCatalogLessonRef = recordCatalogLessonRef === null ? undefined : recordCatalogLessonRef ?? selectedActivity?.catalogLessonRef;
    await request('/api/v1/learning-experiences', {
      id: experienceId, familyId, happenedAt: new Date().toISOString(), title: experienceTitle.trim(),
      ...(selectedActivity === undefined ? {} : { activityId: selectedActivity.id }),
    });
    await request('/api/v1/learner-records', {
      id: id(), experienceId, learnerId: recordLearnerId.trim(), completed: false,
      ...(linkedLessonVersionId === undefined ? {} : { lessonVersionId: linkedLessonVersionId }),
      ...(linkedCatalogLessonRef === undefined ? {} : { catalogLessonRef: linkedCatalogLessonRef }),
      ...(recordObservation.trim() === '' ? {} : { observation: recordObservation.trim() }),
      ...(curriculumVersionId.trim() === '' ? {} : { curriculumVersionId: curriculumVersionId.trim(), configurationSnapshot: { sourceKind: 'family-defined' } }),
    });
    setRecordObservation('');
    setRecordActivityId('');
    setRecordLessonVersionId(undefined);
    setRecordCatalogLessonRef(undefined);
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
  const visibleRecordCatalogRef = recordCatalogLessonRef === null ? undefined : recordCatalogLessonRef ?? selectedRecordActivity?.catalogLessonRef;

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

  const selectedCatalogueLesson = catalogueLessons.find(lesson => lesson.reference === selectedCatalogueLessonRef);
  const filteredCatalogueLessons = catalogueLessons.filter(lesson =>
    lesson.levelKey === catalogueLevel &&
    (catalogueArea === 'all' || lesson.learningAreaKey === catalogueArea) &&
    `${lesson.title} ${lesson.strand} ${lesson.summary} ${lesson.learningGoal}`.toLocaleLowerCase('en-AU').includes(catalogueSearch.trim().toLocaleLowerCase('en-AU')),
  );

  const addCatalogueLessonToPlan = () => withBusy(async () => {
    if (selectedCatalogueLesson === undefined) throw new Error('Choose a starter lesson first.');
    let plan = plans.find(item => item.id === selectedPlanId) ?? plans[0];
    if (plan === undefined) {
      const start = new Date();
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      plan = await request<Plan>('/api/v1/plans', {
        id: id(), familyId, title: planTitle.trim() || 'Learning this week',
        startsOn: start.toISOString().slice(0, 10), endsOn: end.toISOString().slice(0, 10), status: 'active',
      });
    }
    const title = catalogueActivityDraft.trim() || selectedCatalogueLesson.title;
    await request<Activity>('/api/v1/activities', {
      id: id(), familyId, planId: plan.id, title,
      learnerIds: activityLearners.split(',').map(value => value.trim()).filter(Boolean),
      catalogLessonRef: selectedCatalogueLesson.reference,
    });
    await refresh();
    setScreen('workspace');
    setMessage(`Added “${title}” to the weekly plan. The starter lesson is still marked for your review.`);
  }, 'Could not add this starter lesson to the weekly plan. Check the local API.');

  return <SafeAreaView style={styles.safeArea}><ScrollView contentContainerStyle={styles.page}><View style={styles.content}>
    <Button
     title="← Back to product prototype" onPress={onBackToPrototype} />
    <Text accessibilityRole="header" style={styles.title}>HomeLearn</Text>
    <Text style={styles.body}>Plan learning and record what happens. Local demo uses synthetic family and learner IDs only.</Text>
    <View style={styles.navigation}>
      <Button title="Learning workspace" onPress={() => setScreen('workspace')} />
      <Button title={`Starter catalogue (${catalogueLessons.length})`} onPress={() => setScreen('catalogue')} />
      <Button title="Coverage" onPress={() => setScreen('coverage')} />
    </View>
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}

    {screen === 'catalogue' ? <CatalogueBrowser
      lessons={filteredCatalogueLessons}
      coverage={catalogueCoverage}
      pack={cataloguePack}
      level={catalogueLevel}
      learningArea={catalogueArea}
      search={catalogueSearch}
      selectedLesson={selectedCatalogueLesson}
      activityTitle={catalogueActivityDraft}
      onSelectLevel={setCatalogueLevel}
      onSelectArea={setCatalogueArea}
      onSearch={setCatalogueSearch}
      onSelectLesson={lesson => { setSelectedCatalogueLessonRef(lesson.reference); setCatalogueActivityDraft(lesson.title); }}
      onActivityTitleChange={setCatalogueActivityDraft}
      onUseLesson={addCatalogueLessonToPlan}
      busy={busy}
    /> : screen === 'coverage' ? <CatalogueCoverageView cells={catalogueCoverage} /> : <>
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
    {activityCatalogLessonRef ? <Text style={styles.body}>Catalogue lesson: {catalogueLessons.find(lesson => lesson.reference === activityCatalogLessonRef)?.title ?? activityCatalogLessonRef}</Text> : null}
    <Button title="Clear activity lesson" disabled={busy || activityLessonVersionId === ''} onPress={() => setActivityLessonVersionId('')} />
    <Button title="Clear catalogue lesson" disabled={busy || activityCatalogLessonRef === ''} onPress={() => setActivityCatalogLessonRef('')} />
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
      {activity.lessonVersionId ? <Text style={styles.body}>Family lesson: {lessonVersions.find(lesson => lesson.id === activity.lessonVersionId)?.title ?? activity.lessonVersionId}</Text> : null}
      {activity.catalogLessonRef ? <Text style={styles.body}>Starter lesson: {catalogueLessons.find(lesson => lesson.reference === activity.catalogLessonRef)?.title ?? activity.catalogLessonRef}</Text> : null}
      {activity.scheduleHistory?.length ? <Text style={styles.body}>Schedule changes: {activity.scheduleHistory.length}</Text> : null}
      <Button title="Edit activity" disabled={busy} onPress={() => editActivity(activity)} />
      <Button title="Use for learning record" disabled={busy} onPress={() => { setRecordActivityId(activity.id); setExperienceTitle(activity.title); setRecordLessonVersionId(activity.lessonVersionId); setRecordCatalogLessonRef(activity.catalogLessonRef); }} />
    </View>)}

    <Text accessibilityRole="header" style={styles.heading}>Learning records</Text>
    <TextInput accessibilityLabel="Experience title" style={styles.input} value={experienceTitle} onChangeText={setExperienceTitle} />
    <Text style={styles.body}>Planned activity: {activities.find(activity => activity.id === recordActivityId)?.title ?? 'Unplanned experience'}</Text>
    <Button title="Clear planned activity" disabled={busy || recordActivityId === ''} onPress={() => setRecordActivityId('')} />
    <TextInput accessibilityLabel="Learner ID" style={styles.input} value={recordLearnerId} onChangeText={setRecordLearnerId} />
    <TextInput accessibilityLabel="Observation" style={[styles.input, styles.multiline]} multiline value={recordObservation} onChangeText={setRecordObservation} placeholder="Parent observation (optional)" />
    <TextInput accessibilityLabel="Curriculum version ID" style={styles.input} value={curriculumVersionId} onChangeText={setCurriculumVersionId} placeholder="Parent-defined curriculum version (optional)" />
    <Text style={styles.body}>Lesson version: {lessonVersions.find(lesson => lesson.id === visibleRecordLessonId)?.title ?? 'None selected'}</Text>
    {visibleRecordCatalogRef ? <Text style={styles.body}>Starter lesson reference: {catalogueLessons.find(lesson => lesson.reference === visibleRecordCatalogRef)?.title ?? visibleRecordCatalogRef}</Text> : null}
    <Button title="Clear experience lesson" disabled={busy || visibleRecordLessonId === undefined} onPress={() => setRecordLessonVersionId(null)} />
    <Button title="Clear starter lesson" disabled={busy || visibleRecordCatalogRef === undefined} onPress={() => setRecordCatalogLessonRef(null)} />
    <Button title="Record unplanned learning" disabled={busy} onPress={() => void recordLearning()} />
    {experiences.map(experience => <View key={experience.id} style={styles.card}>
      <Text style={styles.item}>{experience.title} · {new Date(experience.happenedAt).toLocaleDateString()}</Text>
      {experience.activityId ? <Text style={styles.body}>Planned activity: {activities.find(activity => activity.id === experience.activityId)?.title ?? experience.activityId}</Text> : null}
      {records.filter(record => record.experienceId === experience.id).map(record => <View key={record.id} style={styles.record}>
        <Text style={styles.body}>{record.learnerId} · {record.completed ? 'Activity completed' : 'Learning recorded; activity completion not marked'}</Text>
        {record.lessonVersionId ? <Text style={styles.body}>Family lesson · {lessonVersions.find(lesson => lesson.id === record.lessonVersionId)?.title ?? record.lessonVersionId}</Text> : null}
        {record.catalogLessonRef ? <Text style={styles.body}>K–12 starter lesson · {catalogueLessons.find(lesson => lesson.reference === record.catalogLessonRef)?.title ?? record.catalogLessonRef}</Text> : null}
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
    </>}
  </View></ScrollView></SafeAreaView>;
}

function CatalogueBrowser({
  lessons, coverage, pack, level, learningArea, search, selectedLesson, activityTitle,
  onSelectLevel, onSelectArea, onSearch, onSelectLesson, onActivityTitleChange, onUseLesson, busy,
}: {
  readonly lessons: readonly CatalogueLesson[];
  readonly coverage: readonly CatalogueCoverageCell[];
  readonly pack: CatalogueResponse['pack'] | undefined;
  readonly level: string;
  readonly learningArea: string;
  readonly search: string;
  readonly selectedLesson: CatalogueLesson | undefined;
  readonly activityTitle: string;
  readonly onSelectLevel: (key: string) => void;
  readonly onSelectArea: (key: string) => void;
  readonly onSearch: (value: string) => void;
  readonly onSelectLesson: (lesson: CatalogueLesson) => void;
  readonly onActivityTitleChange: (value: string) => void;
  readonly onUseLesson: () => void;
  readonly busy: boolean;
}) {
  const levels = coverage.filter((cell, index, all) => all.findIndex(item => item.levelKey === cell.levelKey) === index);
  const areas = coverage.filter((cell, index, all) => all.findIndex(item => item.learningAreaKey === cell.learningAreaKey) === index);
  const selectedCell = coverage.find(cell => cell.levelKey === level && cell.learningAreaKey === learningArea);
  return <View style={styles.catalogue}>
    <Text accessibilityRole="header" style={styles.heading}>K–12 lesson catalogue</Text>
    <Text style={styles.body}>{pack?.title ?? 'Kindergarten–Year 3 starter lessons'} · {pack?.totalLessons ?? lessons.length} original HomeLearn lessons. Other K–12 levels are shown as coverage gaps.</Text>
    <View style={styles.notice}>
      <Text style={styles.noticeTitle}>For parent review</Text>
      <Text style={styles.body}>These original starter lessons are drafts for your review. Check and adapt each lesson before using it. No NSW syllabus mapping is included.</Text>
    </View>
    <Text style={styles.filterLabel}>LEARNING LEVEL</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {levels.map(item => <Pressable key={item.levelKey} accessibilityRole="button" accessibilityState={{ selected: level === item.levelKey }} onPress={() => onSelectLevel(item.levelKey)} style={[styles.chip, level === item.levelKey && styles.chipSelected]}>
        <Text style={[styles.chipText, level === item.levelKey && styles.chipTextSelected]}>{item.levelLabel}</Text>
      </Pressable>)}
    </ScrollView>
    <Text style={styles.filterLabel}>LEARNING AREA</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: learningArea === 'all' }} onPress={() => onSelectArea('all')} style={[styles.chip, learningArea === 'all' && styles.chipSelected]}>
        <Text style={[styles.chipText, learningArea === 'all' && styles.chipTextSelected]}>All areas</Text>
      </Pressable>
      {areas.map(item => <Pressable key={item.learningAreaKey} accessibilityRole="button" accessibilityState={{ selected: learningArea === item.learningAreaKey }} onPress={() => onSelectArea(item.learningAreaKey)} style={[styles.chip, learningArea === item.learningAreaKey && styles.chipSelected]}>
        <Text style={[styles.chipText, learningArea === item.learningAreaKey && styles.chipTextSelected]}>{item.learningArea}</Text>
      </Pressable>)}
    </ScrollView>
    <TextInput accessibilityLabel="Search starter lessons" style={styles.input} placeholder="Search titles, topics or goals" value={search} onChangeText={onSearch} />
    {selectedCell ? <Text style={styles.coverageLine}>
      {selectedCell.status === 'needs-parent-review'
        ? `${selectedCell.draftLessonCount} starter lessons · ${selectedCell.reviewedLessonCount} reviewed · target ${selectedCell.targetLessonCount}`
        : 'No starter lessons for this level and area yet. This gap is intentional and visible.'}
    </Text> : null}
    {lessons.length === 0
      ? <View style={styles.card}><Text style={styles.body}>No matching lessons in this starter pack.</Text></View>
      : lessons.map(lesson => <Pressable key={lesson.reference} accessibilityRole="button" onPress={() => onSelectLesson(lesson)} style={[styles.lessonCard, selectedLesson?.reference === lesson.reference && styles.selectedLessonCard]}>
        <Text style={styles.lessonArea}>{lesson.learningArea} · {lesson.strand}</Text>
        <Text style={styles.item}>{lesson.title}</Text>
        <Text style={styles.body}>{lesson.summary}</Text>
        <Text style={styles.reviewLabel}>Needs parent review · {lesson.estimatedMinutes} minutes</Text>
      </Pressable>)}
    {selectedLesson ? <View style={styles.detailCard}>
      <Text accessibilityRole="header" style={styles.heading}>{selectedLesson.title}</Text>
      <Text style={styles.body}>{selectedLesson.levelLabel} · {selectedLesson.learningArea} · {selectedLesson.strand}</Text>
      <Text style={styles.sectionLabel}>LEARNING GOAL</Text>
      <Text style={styles.body}>{selectedLesson.learningGoal}</Text>
      <Text style={styles.sectionLabel}>SUCCESS CRITERIA</Text>
      {selectedLesson.successCriteria.map(criterion => <Text key={criterion} style={styles.body}>• {criterion}</Text>)}
      <Text style={styles.sectionLabel}>MATERIALS</Text>
      {selectedLesson.materials.map(material => <Text key={material} style={styles.body}>• {material}</Text>)}
      <Text style={styles.sectionLabel}>LESSON STEPS</Text>
      {selectedLesson.steps.map((step, index) => <Text key={step} style={styles.body}>{index + 1}. {step}</Text>)}
      <Text style={styles.sectionLabel}>SUPPORT AND EXTENSION</Text>
      <Text style={styles.body}>Support · {selectedLesson.support}</Text>
      <Text style={styles.body}>Extension · {selectedLesson.extension}</Text>
      <Text style={styles.sectionLabel}>ASK OR WONDER</Text>
      <Text style={styles.body}>{selectedLesson.parentPrompt}</Text>
      <View style={styles.bibleConnection}>
        <Text style={styles.sectionLabel}>BIBLE CONNECTION</Text>
        <Text style={styles.reviewLabel}>{selectedLesson.bibleConnection.reference}</Text>
        <Text style={styles.body}>{selectedLesson.bibleConnection.paraphrase}</Text>
        <Text style={styles.body}>{selectedLesson.bibleConnection.reflectionPrompt}</Text>
        <Text style={styles.caption}>Child-friendly paraphrase; no Bible translation wording is quoted.</Text>
      </View>
      <Text style={styles.reviewLabel}>{selectedLesson.safetyAndAccess}</Text>
      <TextInput accessibilityLabel="Adapted family activity title" style={styles.input} value={activityTitle} onChangeText={onActivityTitleChange} placeholder="Name the activity for your family" />
      <Button title="Use this lesson in the weekly plan" disabled={busy} onPress={onUseLesson} />
      <Text style={styles.body}>The activity keeps a reference to this exact starter-pack version. Recording an activity does not mark a goal as mastered.</Text>
    </View> : null}
  </View>;
}

function CatalogueCoverageView({ cells }: { readonly cells: readonly CatalogueCoverageCell[] }) {
  const levels = cells.filter((cell, index, all) => all.findIndex(item => item.levelKey === cell.levelKey) === index);
  const areas = cells.filter((cell, index, all) => all.findIndex(item => item.learningAreaKey === cell.learningAreaKey) === index);
  const lessonDrafts = cells.reduce((total, cell) => total + cell.draftLessonCount, 0);
  return <View style={styles.catalogue}>
    <Text accessibilityRole="header" style={styles.heading}>Catalogue coverage</Text>
    <Text style={styles.body}>{lessonDrafts} starter lessons across {levels.slice(0, 4).map(level => level.levelLabel).join(', ')}. None have been marked reviewed. The catalogue does not claim complete topic coverage.</Text>
    {levels.map(level => <View key={level.levelKey} style={styles.levelCoverage}>
      <Text accessibilityRole="header" style={styles.coverageTitle}>{level.levelLabel}</Text>
      {areas.map(area => {
        const cell = cells.find(item => item.levelKey === level.levelKey && item.learningAreaKey === area.learningAreaKey);
        if (cell === undefined) return null;
        return <View key={cell.learningAreaKey} style={styles.coverageCell}>
          <Text style={styles.coverageArea}>{cell.learningArea}</Text>
          <Text style={styles.coverageStatus}>{cell.status === 'needs-parent-review'
            ? `${cell.reviewedLessonCount} reviewed · ${cell.draftLessonCount} need review · target ${cell.targetLessonCount}`
            : 'Not in the first content pack'}</Text>
        </View>;
      })}
    </View>)}
    <View style={styles.notice}>
      <Text style={styles.noticeTitle}>Scope reminder</Text>
      <Text style={styles.body}>One or two starter lessons do not mean a learning area or year level is complete. Languages stay in the catalogue taxonomy; shared language lessons need a family-selected language pack.</Text>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f5ef' },
  page: { flexGrow: 1, padding: 24, backgroundColor: '#f7f5ef' },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 14 },
  navigation: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 4 },
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
  catalogue: { gap: 12 },
  chips: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  chip: { borderWidth: 1, borderColor: '#9ba8a2', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  chipSelected: { backgroundColor: '#285b4e', borderColor: '#285b4e' },
  chipText: { color: '#37524a', fontSize: 13 },
  chipTextSelected: { color: '#fff' },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#52645c', letterSpacing: 1 },
  notice: { borderRadius: 10, padding: 14, backgroundColor: '#f2eadc', gap: 6 },
  noticeTitle: { color: '#69573d', fontSize: 16, fontWeight: '700' },
  coverageLine: { color: '#52645c', fontSize: 14, fontWeight: '700' },
  lessonCard: { padding: 14, borderRadius: 10, backgroundColor: '#fff', gap: 5, borderWidth: 1, borderColor: '#e0e4dd' },
  selectedLessonCard: { borderColor: '#4f7b66', borderWidth: 2 },
  lessonArea: { color: '#678371', fontSize: 12, fontWeight: '700' },
  reviewLabel: { color: '#846842', fontSize: 13, fontWeight: '600', lineHeight: 19 },
  detailCard: { padding: 16, borderRadius: 12, backgroundColor: '#fff', gap: 8 },
  bibleConnection: { padding: 12, borderRadius: 10, backgroundColor: '#f2eadc', gap: 6 },
  caption: { color: '#68756d', fontSize: 12, lineHeight: 18 },
  sectionLabel: { color: '#52645c', fontSize: 12, fontWeight: '800', marginTop: 8, letterSpacing: 1 },
  levelCoverage: { padding: 12, borderRadius: 10, backgroundColor: '#fff', gap: 4 },
  coverageTitle: { color: '#183e36', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  coverageCell: { borderTopWidth: 1, borderTopColor: '#e1e6df', paddingVertical: 8, gap: 3 },
  coverageArea: { color: '#37524a', fontSize: 14, fontWeight: '600' },
  coverageStatus: { color: '#76857d', fontSize: 12 },
});
