import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import {
  demoLessons,
  initialActivities,
  initialRecords,
  learners,
  subjects,
  createWeekDays,
  type DemoActivity,
  type DemoLearner,
  type DemoLesson,
  type DemoRecord,
  type Mode,
  type Tab,
} from './features/prototype/data';
import { Chip, HomeTab, JournalTab, LessonsTab, PlannerTab, ProgressTab, TabButton } from './features/prototype/components';
import { styles } from './features/prototype/styles';

export function HomeLearnPrototype({ onOpenApi, onOpenCatalogue }: { readonly onOpenApi: () => void; readonly onOpenCatalogue: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [mode, setMode] = useState<Mode>('Guided');
  const [learnerFilter, setLearnerFilter] = useState<'All learners' | DemoLearner>('All learners');
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [activities, setActivities] = useState<readonly DemoActivity[]>(initialActivities);
  const [records, setRecords] = useState<readonly DemoRecord[]>(initialRecords);
  const [selectedLevel, setSelectedLevel] = useState('Kindergarten');
  const [lessonCatalogueView, setLessonCatalogueView] = useState<'Browse' | 'Coverage'>('Browse');
  const [selectedLessonSubject, setSelectedLessonSubject] = useState('All subjects');
  const [lessonSearch, setLessonSearch] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<DemoLesson | null>(null);
  const [lessonExperienceDraft, setLessonExperienceDraft] = useState('');
  const [recordLessonId, setRecordLessonId] = useState<string>();
  const [recordLessonPickerOpen, setRecordLessonPickerOpen] = useState(false);
  const [recordFamilyExperience, setRecordFamilyExperience] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customSubjects, setCustomSubjects] = useState<readonly string[]>([]);
  const [activitySheetOpen, setActivitySheetOpen] = useState(false);
  const [recordSheetOpen, setRecordSheetOpen] = useState(false);
  const [activityDraft, setActivityDraft] = useState('');
  const [activitySubject, setActivitySubject] = useState('Nature study');
  const [activityLearners, setActivityLearners] = useState<readonly DemoLearner[]>(['Ava', 'Leo']);
  const [activityScheduled, setActivityScheduled] = useState(true);
  const [recordDraft, setRecordDraft] = useState('');
  const [recordLearner, setRecordLearner] = useState<DemoLearner>('Ava');
  const [recordActivityTitle, setRecordActivityTitle] = useState('Unplanned discovery');
  const [savedMessage, setSavedMessage] = useState('');
  const weekDays = useMemo(() => createWeekDays(), []);
  const selectedDate = weekDays[selectedDay]?.fullDate;

  const filteredActivities = activities.filter(activity =>
    (learnerFilter === 'All learners' || activity.learnerIds.includes(learnerFilter)) &&
    activity.dayOffset === selectedDay,
  );
  const filteredRecords = records.filter(record => learnerFilter === 'All learners' || record.learner === learnerFilter);
  const visibleLessons = demoLessons.filter(lesson =>
    (selectedLessonSubject === 'All subjects' || lesson.subject === selectedLessonSubject) &&
    `${lesson.title} ${lesson.subject} ${lesson.focus}`.toLowerCase().includes(lessonSearch.trim().toLowerCase()),
  );

  const chooseDay = (index: number) => {
    setSelectedDay(index);
    setActiveTab('planner');
  };

  const toggleComplete = (activityId: string) => {
    setActivities(current => current.map(activity => activity.id === activityId ? { ...activity, isComplete: !activity.isComplete } : activity));
  };

  const openRecordSheet = (activityTitle = 'Unplanned discovery', learner?: DemoLearner, lessonId?: string, familyExperience?: string) => {
    setRecordActivityTitle(activityTitle);
    if (learner !== undefined) setRecordLearner(learner);
    setRecordLessonId(lessonId);
    setRecordLessonPickerOpen(false);
    setRecordFamilyExperience(familyExperience ?? '');
    setRecordDraft('');
    setRecordSheetOpen(true);
  };

  const saveRecord = () => {
    if (recordDraft.trim() === '') return;
    const newRecord: DemoRecord = {
      id: `record-${Date.now()}`,
      learner: recordLearner,
      activityTitle: recordFamilyExperience.trim() || recordActivityTitle,
      subject: activities.find(activity => activity.title === recordActivityTitle)?.subject ?? demoLessons.find(lesson => lesson.id === recordLessonId)?.subject ?? 'Everyday learning',
      note: recordDraft.trim(),
      happenedAt: 'Just now',
      ...(recordLessonId === undefined ? {} : { lessonId: recordLessonId }),
      ...(recordFamilyExperience.trim() === '' ? {} : { familyExperience: recordFamilyExperience.trim() }),
    };
    setRecords(current => [newRecord, ...current]);
    setRecordSheetOpen(false);
    setActiveTab('journal');
    setSavedMessage('Learning moment saved to your sample journal');
  };

  const saveActivity = () => {
    if (activityDraft.trim() === '' || activityLearners.length === 0) return;
    setActivities(current => [...current, {
      id: `activity-${Date.now()}`,
      title: activityDraft.trim(),
      subject: activitySubject,
      learnerIds: activityLearners,
      ...(activityScheduled ? { startTime: '11:30' } : {}),
      duration: activityScheduled ? '30 min' : 'Flexible',
      dayOffset: selectedDay,
      isComplete: false,
    }]);
    setActivityDraft('');
    setActivitySheetOpen(false);
    setSavedMessage('Activity added to your sample plan');
  };

  const addLessonToPlan = (lesson: DemoLesson, familyExperience = '') => {
    setActivities(current => [...current, {
      id: `lesson-${Date.now()}`,
      title: familyExperience || lesson.title,
      subject: lesson.subject,
      learnerIds: learnerFilter === 'All learners' ? learners : [learnerFilter],
      duration: lesson.duration,
      lessonId: lesson.id,
      ...(familyExperience === '' ? {} : { familyExperience }),
      dayOffset: selectedDay,
      isComplete: false,
    }]);
    setSelectedLesson(null);
    setLessonExperienceDraft('');
    setActiveTab('planner');
    setSavedMessage(familyExperience === '' ? 'Lesson added to your sample plan' : 'Lesson planned with your family experience');
  };

  const addCustomSubject = () => {
    const value = customSubject.trim();
    if (value === '' || customSubjects.includes(value)) return;
    setCustomSubjects(current => [...current, value]);
    setCustomSubject('');
    setSavedMessage(`${value} added as a family-defined subject`);
  };

  const [date] = useState(() => new Date());
  const greeting = date.getHours() < 12 ? 'Good morning' : date.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const todayLabel = date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return <View style={styles.app}>
    <ScrollView contentContainerStyle={styles.scrollContent} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>h</Text></View>
          <Text style={styles.brandName}>homelearn</Text>
          <View style={styles.prototypePill}><Text style={styles.prototypePillText}>PROTOTYPE</Text></View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open local API workflows" onPress={onOpenApi} style={styles.apiButton}>
          <Text style={styles.apiButtonText}>Local API ↗</Text>
        </Pressable>
      </View>

      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.eyebrow}>{todayLabel.toUpperCase()}</Text>
          <Text accessibilityRole="header" style={styles.greeting}>{greeting}, parent.</Text>
          <Text style={styles.greetingSub}>A little structure, lots of room to grow.</Text>
        </View>
        <View style={styles.parentAvatar}><Text style={styles.parentAvatarText}>P</Text></View>
      </View>

      <View style={styles.modeRow}>
        <Text style={styles.modeLabel}>YOUR APPROACH</Text>
        <View style={styles.modePicker}>
          {(['Guided', 'Independent'] as const).map(option => <Pressable key={option} onPress={() => setMode(option)} style={[styles.modeOption, mode === option && styles.modeOptionActive]}>
            <Text style={[styles.modeOptionText, mode === option && styles.modeOptionTextActive]}>{option}</Text>
          </Pressable>)}
        </View>
      </View>

      {savedMessage ? <Pressable accessibilityRole="button" onPress={() => setSavedMessage('')} style={styles.savedToast}><Text style={styles.savedToastText}>✓  {savedMessage}</Text><Text style={styles.toastDismiss}>×</Text></Pressable> : null}

      {activeTab === 'home' ? <HomeTab
        mode={mode}
        learnerFilter={learnerFilter}
        setLearnerFilter={setLearnerFilter}
        weekDays={weekDays}
        selectedDay={selectedDay}
        onChooseDay={chooseDay}
        activities={activities.filter(activity => activity.dayOffset === selectedDay && (learnerFilter === 'All learners' || activity.learnerIds.includes(learnerFilter)))}
        onToggleComplete={toggleComplete}
        onLog={openRecordSheet}
        onAddActivity={() => setActivitySheetOpen(true)}
        onOpenPlanner={() => setActiveTab('planner')}
      /> : null}
      {activeTab === 'lessons' ? <LessonsTab
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        view={lessonCatalogueView}
        onSelectView={setLessonCatalogueView}
        selectedSubject={selectedLessonSubject}
        onSelectSubject={setSelectedLessonSubject}
        search={lessonSearch}
        onSearch={setLessonSearch}
        lessons={visibleLessons}
        customSubjects={customSubjects}
        customSubject={customSubject}
        onCustomSubjectChange={setCustomSubject}
        onAddCustomSubject={addCustomSubject}
        onOpenLesson={setSelectedLesson}
        onOpenLessonWorkshop={onOpenApi}
        onOpenCatalogue={onOpenCatalogue}
      /> : null}
      {activeTab === 'planner' ? <PlannerTab
        weekDays={weekDays}
        selectedDay={selectedDay}
        selectedDate={selectedDate ?? ''}
        onChooseDay={setSelectedDay}
        learnerFilter={learnerFilter}
        setLearnerFilter={setLearnerFilter}
        activities={filteredActivities}
        onToggleComplete={toggleComplete}
        onLog={openRecordSheet}
        onAddActivity={() => setActivitySheetOpen(true)}
      /> : null}
      {activeTab === 'journal' ? <JournalTab records={filteredRecords} learnerFilter={learnerFilter} setLearnerFilter={setLearnerFilter} onAdd={() => openRecordSheet()} /> : null}
      {activeTab === 'progress' ? <ProgressTab learnerFilter={learnerFilter} setLearnerFilter={setLearnerFilter} recordCount={filteredRecords.length} /> : null}

      <View style={styles.sampleNote}><Text style={styles.sampleNoteText}>Sample family · Fictional names and learning records for this prototype</Text></View>
    </ScrollView>

    <View style={styles.tabBar}>
      <TabButton icon="⌂" title="Home" active={activeTab === 'home'} onPress={() => setActiveTab('home')} />
      <TabButton icon="▧" title="Lessons" active={activeTab === 'lessons'} onPress={() => setActiveTab('lessons')} />
      <TabButton icon="▦" title="Planner" active={activeTab === 'planner'} onPress={() => setActiveTab('planner')} />
      <TabButton icon="◉" title="Journal" active={activeTab === 'journal'} onPress={() => setActiveTab('journal')} />
      <TabButton icon="▤" title="Progress" active={activeTab === 'progress'} onPress={() => setActiveTab('progress')} />
    </View>

    <Modal transparent animationType="slide" visible={selectedLesson !== null} onRequestClose={() => setSelectedLesson(null)}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedLesson(null)} />
        {selectedLesson ? <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeading}><Text accessibilityRole="header" style={styles.sheetTitle}>{selectedLesson.title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close lesson preview" onPress={() => setSelectedLesson(null)}><Text style={styles.sheetClose}>×</Text></Pressable></View>
          <ScrollView style={styles.lessonPreviewScroll} contentContainerStyle={styles.lessonPreviewContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.lessonTag}>{selectedLesson.subject.toUpperCase()} · {selectedLesson.strand.toUpperCase()} · {selectedLevel.toUpperCase()}</Text>
            <Text style={styles.formHelper}>{selectedLesson.description}</Text>
            <Text style={styles.formLabel}>LEARNING GOAL</Text><Text style={styles.lessonBody}>{selectedLesson.learningGoal}</Text>
            <Text style={styles.formLabel}>ESTIMATED TIME</Text><Text style={styles.lessonBody}>{selectedLesson.duration}</Text>
            <Text style={styles.formLabel}>MATERIALS</Text><Text style={styles.lessonBody}>{selectedLesson.materials.join(' · ')}</Text>
            <Text style={styles.formLabel}>TRY IT TOGETHER</Text>
            {selectedLesson.steps.map((step, index) => <View key={step} style={styles.lessonStep}><Text style={styles.lessonStepNumber}>{index + 1}</Text><Text style={styles.lessonBody}>{step}</Text></View>)}
            <Text style={styles.formLabel}>ADAPT FOR THIS LEARNER</Text><Text style={styles.lessonBody}>{selectedLesson.adaptation}</Text>
            <Text style={styles.lessonProvenance}>{selectedLesson.provenance} · {selectedLesson.version} · {selectedLesson.reviewStatus}</Text>
            <View style={styles.familyExperiencePanel}>
              <Text style={styles.familyExperienceTitle}>Connect it to family life</Text>
              <Text style={styles.familyExperienceHint}>Use the lesson in an everyday activity or experience you choose.</Text>
              <TextInput accessibilityLabel="Family experience example" placeholder="e.g. bake together and scale the recipe" value={lessonExperienceDraft} onChangeText={setLessonExperienceDraft} style={styles.formInput} />
            </View>
            <View style={styles.separationNote}><Text style={styles.separationIcon}>✳</Text><Text style={styles.separationText}>Prototype idea only. Jurisdiction-specific syllabus references are deferred; this content has not been reviewed for K–12 coverage.</Text></View>
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={() => addLessonToPlan(selectedLesson)} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Add lesson to this week</Text></Pressable>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: lessonExperienceDraft.trim() === '' }} disabled={lessonExperienceDraft.trim() === ''} onPress={() => addLessonToPlan(selectedLesson, lessonExperienceDraft.trim())} style={[styles.familyExperienceButton, lessonExperienceDraft.trim() === '' && styles.familyExperienceButtonDisabled]}><Text style={styles.familyExperienceButtonText}>Plan with family experience</Text></Pressable>
        </View> : null}
      </View>
    </Modal>

    <Modal transparent animationType="slide" visible={activitySheetOpen} onRequestClose={() => setActivitySheetOpen(false)}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={() => setActivitySheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeading}><Text accessibilityRole="header" style={styles.sheetTitle}>Plan an activity</Text><Pressable onPress={() => setActivitySheetOpen(false)}><Text style={styles.sheetClose}>×</Text></Pressable></View>
          <Text style={styles.formLabel}>WHAT ARE YOU EXPLORING?</Text>
          <TextInput accessibilityLabel="Activity idea" placeholder="e.g. Make a weather chart" value={activityDraft} onChangeText={setActivityDraft} style={styles.formInput} />
          <Text style={styles.formLabel}>SUBJECT</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceRow}>
            {subjects.map(subject => <Chip key={subject} label={subject} selected={activitySubject === subject} onPress={() => setActivitySubject(subject)} />)}
          </ScrollView>
          <Text style={styles.formLabel}>WHO WOULD LIKE TO JOIN?</Text>
          <View style={styles.choiceRow}>{learners.map(learner => <Chip key={learner} label={learner} selected={activityLearners.includes(learner)} onPress={() => setActivityLearners(current => current.includes(learner) ? current.filter(item => item !== learner) : [...current, learner])} />)}</View>
          <View style={styles.scheduleFormRow}><View><Text style={styles.formLabel}>ADD A TIME</Text><Text style={styles.scheduleSub}>Or leave it open-ended</Text></View><Switch value={activityScheduled} onValueChange={setActivityScheduled} trackColor={{ false: '#c9cec4', true: '#87a18a' }} /></View>
          {activityScheduled ? <View style={styles.timePreview}><Text style={styles.timePreviewIcon}>◷</Text><Text style={styles.timePreviewText}>Today at 11:30 am · about 30 minutes</Text></View> : null}
          <Pressable accessibilityRole="button" onPress={saveActivity} style={styles.primaryButton}><Text style={styles.primaryButtonText}>Add to this week</Text></Pressable>
        </View>
      </View>
    </Modal>

    <Modal transparent animationType="slide" visible={recordSheetOpen} onRequestClose={() => setRecordSheetOpen(false)}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.modalBackdrop} onPress={() => setRecordSheetOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeading}><Text accessibilityRole="header" style={styles.sheetTitle}>Capture a learning moment</Text><Pressable onPress={() => setRecordSheetOpen(false)}><Text style={styles.sheetClose}>×</Text></Pressable></View>
          <ScrollView style={styles.recordFormScroll} contentContainerStyle={styles.recordFormContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.formHelper}>The small things are often the important things.</Text>
            <Text style={styles.formLabel}>WHO WAS LEARNING?</Text>
            <View style={styles.choiceRow}>{learners.map(learner => <Chip key={learner} label={learner} selected={recordLearner === learner} onPress={() => setRecordLearner(learner)} />)}</View>
            <Text style={styles.formLabel}>WHAT HAPPENED?</Text>
            <TextInput accessibilityLabel="Learning observation" multiline placeholder="What did they notice, try, or ask?" value={recordDraft} onChangeText={setRecordDraft} style={[styles.formInput, styles.observationInput]} />
            <Text style={styles.formLabel}>FAMILY ACTIVITY OR EXPERIENCE</Text>
            <TextInput accessibilityLabel="Family activity or experience" placeholder="e.g. baking together or visiting a museum" value={recordFamilyExperience} onChangeText={setRecordFamilyExperience} style={styles.formInput} />
            <Text style={styles.linkedActivity}>Linked to · {recordActivityTitle}</Text>
            <Text style={styles.formLabel}>CONNECT TO A K–12 LESSON (OPTIONAL)</Text>
            {recordLessonId ? <View style={styles.selectedLessonLink}><Text style={styles.selectedLessonLinkText}>Lesson · {demoLessons.find(lesson => lesson.id === recordLessonId)?.title}</Text><Pressable accessibilityRole="button" onPress={() => setRecordLessonId(undefined)}><Text style={styles.link}>Remove</Text></Pressable></View> : null}
            <Pressable accessibilityRole="button" onPress={() => setRecordLessonPickerOpen(current => !current)} style={styles.lessonPickerButton}><Text style={styles.lessonPickerButtonText}>{recordLessonPickerOpen ? 'Close lesson list' : recordLessonId ? 'Choose a different lesson' : 'Choose a lesson to link'}</Text></Pressable>
            {recordLessonPickerOpen ? <ScrollView style={styles.recordLessonPicker} nestedScrollEnabled showsVerticalScrollIndicator>
              {demoLessons.map(lesson => <Pressable accessibilityRole="button" key={lesson.id} onPress={() => { setRecordLessonId(lesson.id); setRecordLessonPickerOpen(false); }} style={styles.recordLessonOption}>
                <Text style={styles.recordLessonTitle}>{lesson.title}</Text><Text style={styles.recordLessonSubject}>{lesson.subject} · {lesson.strand}</Text>
              </Pressable>)}
            </ScrollView> : null}
            <View style={styles.separationNote}><Text style={styles.separationIcon}>✳</Text><Text style={styles.separationText}>An observation records what happened. It doesn’t automatically mean a goal was mastered.</Text></View>
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={saveRecord} style={[styles.primaryButton, recordDraft.trim() === '' && styles.primaryButtonDisabled]}><Text style={styles.primaryButtonText}>Save learning moment</Text></Pressable>
        </View>
      </View>
    </Modal>
  </View>;
}
