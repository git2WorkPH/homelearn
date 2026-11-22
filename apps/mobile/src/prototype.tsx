import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

type Tab = 'home' | 'lessons' | 'planner' | 'journal' | 'progress';
type Mode = 'Guided' | 'Independent';
type DemoLearner = 'Ava' | 'Leo';
type DemoActivity = {
  readonly id: string;
  readonly title: string;
  readonly subject: string;
  readonly learnerIds: readonly DemoLearner[];
  readonly startTime?: string;
  readonly duration: string;
  readonly lessonId?: string;
  readonly familyExperience?: string;
  readonly dayOffset: number;
  readonly isComplete: boolean;
};
type DemoRecord = {
  readonly id: string;
  readonly learner: DemoLearner;
  readonly activityTitle: string;
  readonly subject: string;
  readonly note: string;
  readonly happenedAt: string;
  readonly lessonId?: string;
  readonly familyExperience?: string;
};
type DemoLesson = { readonly id: string; readonly title: string; readonly subject: string; readonly strand: string; readonly focus: string; readonly learningGoal: string; readonly materials: readonly string[]; readonly adaptation: string; readonly duration: string; readonly description: string; readonly steps: readonly string[]; readonly provenance: string; readonly version: string; readonly reviewStatus: string };

const learners: readonly DemoLearner[] = ['Ava', 'Leo'];
const subjects = ['Literacy', 'Mathematics', 'Nature study', 'Creative arts', 'Movement'];
const todayOffset = (new Date().getDay() + 6) % 7;
const initialActivities: readonly DemoActivity[] = [
  { id: 'read-aloud', title: 'Morning read-aloud', subject: 'Literacy', learnerIds: ['Ava', 'Leo'], startTime: '9:00', duration: '20 min', dayOffset: todayOffset, isComplete: true },
  { id: 'seed-detectives', title: 'Seed detectives', subject: 'Nature study', learnerIds: ['Ava', 'Leo'], startTime: '10:30', duration: '35 min', dayOffset: todayOffset, isComplete: false },
  { id: 'cardboard-city', title: 'Build a cardboard city', subject: 'Creative arts', learnerIds: ['Ava'], duration: 'Flexible', dayOffset: todayOffset, isComplete: false },
  { id: 'number-garden', title: 'Number garden', subject: 'Mathematics', learnerIds: ['Leo'], startTime: '13:30', duration: '25 min', dayOffset: Math.min(todayOffset + 1, 6), isComplete: false },
  { id: 'story-walk', title: 'Story walk', subject: 'Movement', learnerIds: ['Ava', 'Leo'], startTime: '10:00', duration: '30 min', dayOffset: Math.min(todayOffset + 2, 6), isComplete: false },
];
const initialRecords: readonly DemoRecord[] = [
  { id: 'note-1', learner: 'Ava', activityTitle: 'Morning read-aloud', subject: 'Literacy', note: 'Paused to predict what the character might do next.', happenedAt: 'Today · 9:24 am' },
  { id: 'note-2', learner: 'Leo', activityTitle: 'Seed detectives', subject: 'Nature study', note: 'Sorted the seeds by shape, then noticed two had the same colour.', happenedAt: 'Yesterday · 11:10 am' },
  { id: 'note-3', learner: 'Ava', activityTitle: 'Cardboard city', subject: 'Creative arts', note: 'Changed the design after testing how the bridge held weight.', happenedAt: 'Yesterday · 2:05 pm' },
];
const subjectColors: Record<string, string> = {
  Literacy: '#d7825d',
  Mathematics: '#7584a7',
  'Nature study': '#73937a',
  'Creative arts': '#b18b68',
  Movement: '#82a8a0',
};
const learningLevels = ['Kindergarten', ...Array.from({ length: 12 }, (_, index) => `Year ${index + 1}`)];
const lessonSubjects = ['English', 'Mathematics', 'Science', 'Humanities & social sciences', 'Technologies', 'The arts', 'Health & physical education', 'Languages', 'Cross-curricular', 'Family-defined'];
const lessonCoverageExamples = [
  { subject: 'English', strand: 'Reading & writing', scope: 6, drafted: 3, reviewed: 0, status: 'Drafting' },
  { subject: 'Mathematics', strand: 'Number & patterns', scope: 7, drafted: 4, reviewed: 0, status: 'In review' },
  { subject: 'Science', strand: 'Inquiry & living systems', scope: 6, drafted: 1, reviewed: 0, status: 'Drafting' },
  { subject: 'Humanities & social sciences', strand: 'History & geography', scope: 5, drafted: 0, reviewed: 0, status: 'Planned' },
  { subject: 'Technologies', strand: 'Design & digital technologies', scope: 5, drafted: 0, reviewed: 0, status: 'Planned' },
  { subject: 'The arts', strand: 'Dance, drama, media, music, visual arts', scope: 6, drafted: 1, reviewed: 0, status: 'Drafting' },
  { subject: 'Health & physical education', strand: 'Wellbeing & movement', scope: 5, drafted: 0, reviewed: 0, status: 'Planned' },
  { subject: 'Languages', strand: 'Family-selected languages', scope: 4, drafted: 0, reviewed: 0, status: 'Planned' },
  { subject: 'Cross-curricular', strand: 'Sustainability, finance, life skills, inquiry', scope: 5, drafted: 0, reviewed: 0, status: 'Planned' },
];
const demoLessons: readonly DemoLesson[] = [
  { id: 'story-shapes', title: 'Stories in shapes', subject: 'English', strand: 'Oral language & literature', focus: 'Speaking, listening & storytelling', learningGoal: 'Retell a story and describe how a character, setting, or viewpoint shapes it.', materials: ['Paper', 'Drawing materials', 'A familiar story (optional)'], adaptation: 'Invite oral retelling and drawing, or compare multiple viewpoints and craft a new ending.', duration: '30 min', description: 'Notice how a story changes when its setting, character, or point of view changes.', steps: ['Choose a familiar story or make one up together.', 'Draw three shapes to represent a beginning, a change, and an ending.', 'Retell the story and talk about what changed.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'pattern-lab', title: 'Pattern detectives', subject: 'Mathematics', strand: 'Algebra & patterns', focus: 'Patterns, rules & reasoning', learningGoal: 'Describe a pattern rule and use it to predict what comes next.', materials: ['Household objects, sounds, or movement'], adaptation: 'Start with concrete repeats, or express a growing rule with symbols and justify a prediction.', duration: '25 min', description: 'Find a repeating or growing pattern in everyday objects, movement, or sound.', steps: ['Gather a few objects or choose a sound and movement.', 'Build a pattern, then invite your learner to describe its rule.', 'Change one part and discuss how the pattern grows.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'tiny-ecosystems', title: 'A tiny ecosystem', subject: 'Science', strand: 'Biological sciences & inquiry', focus: 'Living things & interdependence', learningGoal: 'Observe relationships between living things and the conditions around them.', materials: ['Notebook or paper', 'Pencil', 'Optional magnifier'], adaptation: 'Draw and name observations, or compare evidence and explain how a change could affect the system.', duration: '40 min', description: 'Explore how living things depend on the conditions and other organisms around them.', steps: ['Observe a small outdoor habitat without disturbing it.', 'Sketch what is living, non-living, and changing.', 'Wonder together: what might happen if one part changed?'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'place-stories', title: 'Stories held by a place', subject: 'Humanities & social sciences', strand: 'History & geography', focus: 'Place, memory & change', learningGoal: 'Describe how people and environments shape a place over time.', materials: ['Paper', 'Drawing materials', 'A familiar place to observe'], adaptation: 'Map a familiar place, or compare sources and explain changes and differing perspectives.', duration: '35 min', description: 'Use a familiar place to explore how environments and people shape one another over time.', steps: ['Choose a local place, room, or landscape.', 'Map what is there now and what may have been there before.', 'Record questions to investigate with family-approved sources.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'sound-colour', title: 'Sound into colour', subject: 'The arts', strand: 'Music & visual arts', focus: 'Creative response & reflection', learningGoal: 'Make and explain a creative response to a sound or musical idea.', materials: ['Paper or reusable materials', 'Drawing materials', 'A soundscape or music (optional)'], adaptation: 'Respond with movement or marks, or compare techniques and explain creative choices.', duration: '30 min', description: 'Translate sounds, music, or environmental noise into a visual composition.', steps: ['Listen to a short soundscape.', 'Choose lines, colours, or textures that match what you hear.', 'Share one choice you made and what inspired it.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'movement-map', title: 'Make a movement map', subject: 'Health & physical education', strand: 'Movement & wellbeing', focus: 'Movement, coordination & wellbeing', learningGoal: 'Create a safe movement sequence and notice how the body feels.', materials: ['Clear, safe space', 'Optional music'], adaptation: 'Choose accessible movements, or plan and reflect on how to adapt the sequence for different needs.', duration: '20 min', description: 'Create a sequence of movements and notice how the body feels before and after.', steps: ['Pick four safe movements for your space.', 'Arrange them into a sequence and practise at a comfortable pace.', 'Pause, notice breathing and energy, and adapt the sequence.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'design-bridge', title: 'Bridge design challenge', subject: 'Technologies', strand: 'Design & engineering', focus: 'Design, test & improve', learningGoal: 'Test a design against a chosen constraint and explain an improvement.', materials: ['Cardboard or reusable materials', 'Tape', 'Small safe test weights'], adaptation: 'Build and test a simple model, or compare constraints and record evidence for a design revision.', duration: '45 min', description: 'Design a small bridge from reusable materials, then test and improve one feature.', steps: ['Sketch a bridge for a simple family-defined challenge.', 'Build with safe household materials and test gently.', 'Change one feature and compare what happened.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'word-collectors', title: 'A word collection', subject: 'Languages', strand: 'Communication & culture', focus: 'Language, culture & communication', learningGoal: 'Use selected words in a meaningful everyday exchange.', materials: ['Notebook or labels', 'Family-approved language source or speaker'], adaptation: 'Practise a few useful words, or compare how meaning changes across context and audience.', duration: '20 min', description: 'Collect useful words from a language your family is learning and connect each to a real context.', steps: ['Choose a small everyday theme.', 'Gather a few words using a family-approved source or speaker.', 'Use them in a greeting, label, or short exchange.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'market-math', title: 'Plan a pretend market', subject: 'Cross-curricular', strand: 'Financial literacy', focus: 'Needs, choices & simple budgets', learningGoal: 'Compare choices using quantities and a family-defined spending limit.', materials: ['Reusable household objects', 'Paper price labels', 'Optional counters'], adaptation: 'Make simple choices with counters, or compare budgets and explain trade-offs.', duration: '35 min', description: 'Use a pretend market to explore choices, quantities, and family-defined spending limits.', steps: ['Set up a pretend stall with reusable objects.', 'Give each object a made-up price.', 'Make a shopping choice and explain the trade-offs.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'water-watch', title: 'Where does the water go?', subject: 'Cross-curricular', strand: 'Sustainability & environment', focus: 'Observation & resource use', learningGoal: 'Trace an everyday resource-use question and suggest a change to investigate.', materials: ['Notebook or paper', 'Pencil'], adaptation: 'Draw a simple water-use path, or investigate a system and compare evidence for possible changes.', duration: '25 min', description: 'Trace a household water use question and identify one practical way to reduce waste.', steps: ['Choose one everyday water use to observe.', 'Draw or describe where the water comes from and goes.', 'Choose a small change to try and revisit later.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
  { id: 'family-interest', title: 'Follow a family question', subject: 'Family-defined', strand: 'Learner-selected inquiry', focus: 'Learner-selected inquiry', learningGoal: 'Explore a learner-chosen question and describe what was discovered.', materials: ['Chosen by the learner and parent for the inquiry'], adaptation: 'Let the learner choose the format and level of support; extend through independent research or making.', duration: 'Flexible', description: 'Turn a learner’s own question into a small investigation shaped by your family’s approach.', steps: ['Write down the question in the learner’s words.', 'Choose a way to explore it: make, read, observe, interview, or experiment.', 'Save a reflection or piece of evidence if it feels useful.'], provenance: 'Original HomeLearn prototype idea', version: 'Demo 0.2', reviewStatus: 'Illustrative · not reviewed' },
];

function startOfWeek(date: Date): Date {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return monday;
}

function createWeekDays(): readonly { readonly label: string; readonly date: number; readonly fullDate: string }[] {
  const monday = startOfWeek(new Date());
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + offset);
    return {
      label: date.toLocaleDateString('en-AU', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().slice(0, 10),
    };
  });
}

function shortWeekLabel(days: ReturnType<typeof createWeekDays>): string {
  const monday = startOfWeek(new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const month = monday.toLocaleDateString('en-AU', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-AU', { month: 'short' });
  return `${days[0]?.date} ${month} – ${days[6]?.date} ${endMonth}`;
}

function Chip({ label, selected, onPress }: { readonly label: string; readonly selected: boolean; readonly onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </Pressable>;
}

function SectionHeading({ title, action, onAction }: { readonly title: string; readonly action?: string; readonly onAction?: () => void }) {
  return <View style={styles.sectionHeading}>
    <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
    {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction}><Text style={styles.link}>{action}</Text></Pressable> : null}
  </View>;
}

function LearnerAvatars({ names }: { readonly names: readonly DemoLearner[] }) {
  return <View style={styles.avatars}>
    {names.map((name, index) => <View key={name} style={[styles.avatar, index > 0 && styles.avatarOverlap, name === 'Leo' ? styles.avatarLeo : styles.avatarAva]}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>)}
  </View>;
}

function ActivityCard({ activity, onToggle, onLog }: { readonly activity: DemoActivity; readonly onToggle: () => void; readonly onLog: () => void }) {
  const color = subjectColors[activity.subject] ?? '#789087';
  return <View style={styles.activityCard}>
    <View style={[styles.activityAccent, { backgroundColor: color }]} />
    <View style={styles.activityBody}>
      <View style={styles.activityTop}>
        <Text style={[styles.subjectLabel, { color }]}>{activity.subject.toUpperCase()}</Text>
        <Text style={styles.activityTime}>{activity.startTime ?? 'Flexible'}</Text>
      </View>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      {activity.lessonId ? <Text style={styles.linkedLessonText}>K–12 lesson · {demoLessons.find(lesson => lesson.id === activity.lessonId)?.title ?? 'Lesson'}</Text> : null}
      <View style={styles.activityMeta}>
        <LearnerAvatars names={activity.learnerIds} />
        <Text style={styles.metaText}>{activity.duration}</Text>
        {activity.isComplete ? <Text style={styles.completeBadge}>Done</Text> : <Text style={styles.planBadge}>Planned</Text>}
      </View>
      <View style={styles.activityActions}>
        <Pressable accessibilityRole="button" onPress={onLog} style={styles.logAction}>
          <Text style={styles.logActionText}>＋ Log learning</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={activity.isComplete ? 'Mark activity not complete' : 'Mark activity complete'} onPress={onToggle} style={[styles.checkAction, activity.isComplete && styles.checkActionDone]}>
          <Text style={[styles.checkActionText, activity.isComplete && styles.checkActionTextDone]}>{activity.isComplete ? '✓' : '○'}</Text>
        </Pressable>
      </View>
    </View>
  </View>;
}

export function HomeLearnPrototype({ onOpenApi }: { readonly onOpenApi: () => void }) {
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

function HomeTab({ mode, learnerFilter, setLearnerFilter, weekDays, selectedDay, onChooseDay, activities, onToggleComplete, onLog, onAddActivity, onOpenPlanner }: {
  readonly mode: Mode;
  readonly learnerFilter: 'All learners' | DemoLearner;
  readonly setLearnerFilter: (value: 'All learners' | DemoLearner) => void;
  readonly weekDays: ReturnType<typeof createWeekDays>;
  readonly selectedDay: number;
  readonly onChooseDay: (index: number) => void;
  readonly activities: readonly DemoActivity[];
  readonly onToggleComplete: (id: string) => void;
  readonly onLog: (title?: string, learner?: DemoLearner, lessonId?: string, familyExperience?: string) => void;
  readonly onAddActivity: () => void;
  readonly onOpenPlanner: () => void;
}) {
  const completeCount = activities.filter(activity => activity.isComplete).length;
  const [date] = useState(() => new Date());
  const dateLabel = date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  return <View>
    <View style={styles.learnerChips}>{(['All learners', ...learners] as const).map(learner => <Chip key={learner} label={learner} selected={learnerFilter === learner} onPress={() => setLearnerFilter(learner)} />)}</View>
    <Pressable onPress={onOpenPlanner} style={styles.weekCard}>
      <View style={styles.weekCardHeader}><View><Text style={styles.weekKicker}>THIS WEEK · {shortWeekLabel(weekDays).toUpperCase()}</Text><Text style={styles.weekTitle}>Learning, your way.</Text></View><Text style={styles.weekArrow}>↗</Text></View>
      <Text style={styles.weekCopy}>{mode === 'Guided' ? 'A gentle rhythm is taking shape. There’s room for the unexpected, too.' : 'Your plans are ready when you are. Leave space for curiosity.'}</Text>
      <View style={styles.progressMeta}><Text style={styles.progressCount}>{completeCount + 5} <Text style={styles.progressTotal}>/ 12 moments</Text></Text><Text style={styles.progressHint}>A week in progress</Text></View>
      <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, ((completeCount + 5) / 12) * 100)}%` }]} /></View>
      <View style={styles.weekDots}>{weekDays.map((day, index) => <View key={day.fullDate} style={[styles.weekDot, index <= selectedDay && styles.weekDotActive, index === selectedDay && styles.weekDotToday]} />)}</View>
    </Pressable>

    <View style={styles.dayStrip}>{weekDays.map((day, index) => <Pressable key={day.fullDate} onPress={() => onChooseDay(index)} style={[styles.dayCell, selectedDay === index && styles.dayCellSelected]}>
      <Text style={[styles.dayLabel, selectedDay === index && styles.dayTextSelected]}>{day.label}</Text><Text style={[styles.dayNumber, selectedDay === index && styles.dayTextSelected]}>{day.date}</Text>
      <View style={[styles.dayDot, index <= selectedDay && styles.dayDotFilled]} />
    </Pressable>)}</View>

    <SectionHeading title="Today at your pace" action="See week" onAction={onOpenPlanner} />
    {activities.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyText}>A little breathing room today.</Text><Pressable onPress={onAddActivity}><Text style={styles.link}>Plan something small</Text></Pressable></View> : activities.slice(0, 3).map(activity => <ActivityCard key={activity.id} activity={activity} onToggle={() => onToggleComplete(activity.id)} onLog={() => onLog(activity.title, activity.learnerIds[0], activity.lessonId, activity.familyExperience)} />)}
    <Pressable accessibilityRole="button" onPress={onAddActivity} style={styles.addActivityButton}><Text style={styles.addActivityPlus}>＋</Text><Text style={styles.addActivityText}>Add an activity</Text></Pressable>

    <View style={styles.ideaCard}>
      <View style={styles.ideaIcon}><Text style={styles.ideaIconText}>✳</Text></View>
      <View style={styles.ideaTextBlock}><Text style={styles.ideaKicker}>A LITTLE IDEA FOR {dateLabel.toUpperCase()}</Text><Text style={styles.ideaTitle}>{mode === 'Guided' ? 'Take learning outside' : 'Follow a question'}</Text><Text style={styles.ideaCopy}>{mode === 'Guided' ? 'Collect three different leaves and compare their edges together.' : 'Ask what your learners are curious about today, then see where it goes.'}</Text></View>
      <Text style={styles.ideaArrow}>›</Text>
    </View>
  </View>;
}

function PlannerTab({ weekDays, selectedDay, selectedDate, onChooseDay, learnerFilter, setLearnerFilter, activities, onToggleComplete, onLog, onAddActivity }: {
  readonly weekDays: ReturnType<typeof createWeekDays>;
  readonly selectedDay: number;
  readonly selectedDate: string;
  readonly onChooseDay: (index: number) => void;
  readonly learnerFilter: 'All learners' | DemoLearner;
  readonly setLearnerFilter: (value: 'All learners' | DemoLearner) => void;
  readonly activities: readonly DemoActivity[];
  readonly onToggleComplete: (id: string) => void;
  readonly onLog: (title?: string, learner?: DemoLearner, lessonId?: string, familyExperience?: string) => void;
  readonly onAddActivity: () => void;
}) {
  const selected = weekDays[selectedDay];
  return <View>
    <View style={styles.pageTitleRow}><View><Text style={styles.eyebrow}>YOUR FAMILY RHYTHM</Text><Text accessibilityRole="header" style={styles.pageTitle}>Weekly plan</Text></View><Pressable accessibilityRole="button" onPress={onAddActivity} style={styles.roundAdd}><Text style={styles.roundAddText}>＋</Text></Pressable></View>
    <Text style={styles.weekRange}>{shortWeekLabel(weekDays)} · {selectedDate.slice(0, 4)}</Text>
    <View style={styles.dayStrip}>{weekDays.map((day, index) => <Pressable key={day.fullDate} onPress={() => onChooseDay(index)} style={[styles.dayCell, selectedDay === index && styles.dayCellSelected]}>
      <Text style={[styles.dayLabel, selectedDay === index && styles.dayTextSelected]}>{day.label}</Text><Text style={[styles.dayNumber, selectedDay === index && styles.dayTextSelected]}>{day.date}</Text><View style={[styles.dayDot, index <= selectedDay && styles.dayDotFilled]} />
    </Pressable>)}</View>
    <View style={styles.learnerChips}>{(['All learners', ...learners] as const).map(learner => <Chip key={learner} label={learner} selected={learnerFilter === learner} onPress={() => setLearnerFilter(learner)} />)}</View>
    <View style={styles.planDateHeading}><Text style={styles.planDateTitle}>{selected?.label}, {selected?.date}</Text><Text style={styles.planDateSubtitle}>{activities.length} planned {activities.length === 1 ? 'activity' : 'activities'}</Text></View>
    {activities.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyText}>Nothing planned for this day.</Text><Text style={styles.formHelper}>Open space is part of the plan.</Text></View> : activities.map(activity => <ActivityCard key={activity.id} activity={activity} onToggle={() => onToggleComplete(activity.id)} onLog={() => onLog(activity.title, activity.learnerIds[0], activity.lessonId, activity.familyExperience)} />)}
    <Pressable accessibilityRole="button" onPress={onAddActivity} style={styles.plannerAdd}><Text style={styles.plannerAddText}>＋  Add to {selected?.label ?? 'this day'}</Text></Pressable>
    <View style={styles.plannerNote}><Text style={styles.plannerNoteIcon}>↝</Text><Text style={styles.plannerNoteText}>A plan is a helpful guide, not a checklist. Move things around or leave the day open.</Text></View>
  </View>;
}

function LessonsTab({ selectedLevel, onSelectLevel, view, onSelectView, selectedSubject, onSelectSubject, search, onSearch, lessons, customSubjects, customSubject, onCustomSubjectChange, onAddCustomSubject, onOpenLesson, onOpenLessonWorkshop }: {
  readonly selectedLevel: string;
  readonly onSelectLevel: (value: string) => void;
  readonly view: 'Browse' | 'Coverage';
  readonly onSelectView: (value: 'Browse' | 'Coverage') => void;
  readonly selectedSubject: string;
  readonly onSelectSubject: (value: string) => void;
  readonly search: string;
  readonly onSearch: (value: string) => void;
  readonly lessons: readonly DemoLesson[];
  readonly customSubjects: readonly string[];
  readonly customSubject: string;
  readonly onCustomSubjectChange: (value: string) => void;
  readonly onAddCustomSubject: () => void;
  readonly onOpenLesson: (lesson: DemoLesson) => void;
  readonly onOpenLessonWorkshop: () => void;
}) {
  const subjectOptions = ['All subjects', ...lessonSubjects, ...customSubjects];
  return <View>
    <View style={styles.pageTitleRow}><View><Text style={styles.eyebrow}>A LIBRARY THAT GROWS WITH YOU</Text><Text accessibilityRole="header" style={styles.pageTitle}>Lessons</Text></View><View style={styles.progressFlower}><Text style={styles.progressFlowerText}>✳</Text></View></View>
    <Text style={styles.greetingSub}>Browse Kindergarten through Year 12, across the learning areas your family chooses.</Text>
    <View style={styles.lessonBanner}><Text style={styles.lessonBannerTitle}>Find a place to begin</Text><Text style={styles.lessonBannerText}>Browse by level and learning area. Use a lesson as written, adapt it, or simply follow the question it sparks.</Text></View>
    <Pressable accessibilityRole="button" onPress={onOpenLessonWorkshop} style={styles.lessonCreateCard}>
      <Text style={styles.lessonCreateTitle}>Create a family lesson</Text>
      <Text style={styles.lessonCreateText}>Write your own lesson or shape a local AI draft, then use it in your family’s plan and learning record.</Text>
      <Text style={styles.lessonCreateAction}>Open lesson workshop ›</Text>
    </Pressable>
    <Text style={styles.formLabel}>LEARNING LEVEL</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceRow}>
      {learningLevels.map(level => <Chip key={level} label={level === 'Kindergarten' ? 'Kindergarten' : level.replace('Year ', 'Yr ')} selected={selectedLevel === level} onPress={() => onSelectLevel(level)} />)}
    </ScrollView>
    <View style={styles.catalogueViewToggle}>{(['Browse', 'Coverage'] as const).map(option => <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: view === option }} onPress={() => onSelectView(option)} style={[styles.catalogueViewOption, view === option && styles.catalogueViewOptionSelected]}><Text style={[styles.catalogueViewText, view === option && styles.catalogueViewTextSelected]}>{option === 'Coverage' ? 'Review coverage' : option + ' lessons'}</Text></Pressable>)}</View>
    {view === 'Coverage' ? <CoverageView level={selectedLevel} /> : <>
    <TextInput accessibilityLabel="Search lesson ideas" placeholder="Search lessons or learning goals" value={search} onChangeText={onSearch} style={styles.formInput} />
    <Text style={styles.formLabel}>SUBJECTS</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.choiceRow}>
      {subjectOptions.map(subject => <Chip key={subject} label={subject} selected={selectedSubject === subject} onPress={() => onSelectSubject(subject)} />)}
    </ScrollView>
    <View style={styles.catalogNote}><Text style={styles.catalogNoteIcon}>⌑</Text><Text style={styles.catalogNoteText}>Sample ideas are original and illustrative. NSW syllabus references are deferred and are not included here.</Text></View>
    <SectionHeading title="Ideas to explore" />
    {lessons.length === 0 ? <View style={styles.emptyCard}><Text style={styles.emptyText}>No matching lesson ideas yet.</Text><Text style={styles.formHelper}>Try another subject or search term.</Text></View> : lessons.map(lesson => <Pressable accessibilityRole="button" key={lesson.id} onPress={() => onOpenLesson(lesson)} style={styles.lessonCard}>
      <View style={styles.lessonCardTop}><Text style={styles.lessonTag}>{lesson.subject.toUpperCase()} · {lesson.strand.toUpperCase()}</Text><Text style={styles.lessonDuration}>{lesson.duration}</Text></View>
      <Text style={styles.lessonTitle}>{lesson.title}</Text><Text style={styles.lessonFocus}>{lesson.focus}</Text>
      <View style={styles.lessonCardBottom}><Text style={styles.lessonLevel}>Selected level · {selectedLevel}</Text><Text style={styles.lessonArrow}>›</Text></View>
    </Pressable>)}
    <SectionHeading title="Make it yours" />
    <View style={styles.customSubjectCard}><Text style={styles.lessonTitle}>Add a family subject</Text><Text style={styles.formHelper}>Create a learning area that reflects your family’s curriculum or interests.</Text><View style={styles.customSubjectRow}><TextInput accessibilityLabel="Family-defined subject name" placeholder="e.g. Bush skills" value={customSubject} onChangeText={onCustomSubjectChange} style={[styles.formInput, styles.customSubjectInput]} /><Pressable accessibilityRole="button" onPress={onAddCustomSubject} style={styles.customSubjectButton}><Text style={styles.customSubjectButtonText}>Add</Text></Pressable></View>{customSubjects.length > 0 ? <Text style={styles.customSubjectList}>Your subjects · {customSubjects.join(' · ')}</Text> : null}</View>
    </>}
  </View>;
}

function CoverageView({ level }: { readonly level: string }) {
  return <View>
    <View style={styles.coverageNotice}><Text style={styles.coverageNoticeTitle}>Coverage for {level}</Text><Text style={styles.catalogNoteText}>Illustrative tracker only. No sample lesson has been editorially reviewed and no level is marked complete.</Text></View>
    {lessonCoverageExamples.map(item => <View key={item.subject} style={styles.coverageCard}>
      <View style={styles.coverageCardTop}><Text style={styles.lessonTitle}>{item.subject}</Text><Text style={[styles.coverageStatus, item.status === 'In review' && styles.coverageStatusReview]}>{item.status}</Text></View>
      <Text style={styles.lessonFocus}>{item.strand}</Text>
      <View style={styles.coverageCounts}><Text style={styles.lessonLevel}>{item.drafted} of {item.scope} scope items drafted</Text><Text style={styles.lessonLevel}>{item.reviewed} reviewed</Text></View>
      <View style={styles.progressAreaTrack}><View style={[styles.progressAreaFill, { width: `${Math.round((item.drafted / item.scope) * 100)}%`, backgroundColor: item.status === 'In review' ? '#b18b68' : '#73937a' }]} /></View>
    </View>)}
    <View style={styles.catalogNote}><Text style={styles.catalogNoteIcon}>◎</Text><Text style={styles.catalogNoteText}>“Available” will mean at least one reviewed lesson for a level and topic. “Complete to defined scope” requires every topic target in the versioned content plan to pass review.</Text></View>
  </View>;
}

function JournalTab({ records, learnerFilter, setLearnerFilter, onAdd }: {
  readonly records: readonly DemoRecord[];
  readonly learnerFilter: 'All learners' | DemoLearner;
  readonly setLearnerFilter: (value: 'All learners' | DemoLearner) => void;
  readonly onAdd: () => void;
}) {
  return <View>
    <View style={styles.pageTitleRow}><View><Text style={styles.eyebrow}>WHAT THEY NOTICE MATTERS</Text><Text accessibilityRole="header" style={styles.pageTitle}>Learning journal</Text></View><Pressable accessibilityRole="button" onPress={onAdd} style={styles.roundAdd}><Text style={styles.roundAddText}>＋</Text></Pressable></View>
    <Text style={styles.greetingSub}>Small moments, saved for later.</Text>
    <View style={styles.learnerChips}>{(['All learners', ...learners] as const).map(learner => <Chip key={learner} label={learner} selected={learnerFilter === learner} onPress={() => setLearnerFilter(learner)} />)}</View>
    <Pressable accessibilityRole="button" onPress={onAdd} style={styles.captureCard}><View style={styles.captureIcon}><Text style={styles.captureIconText}>✎</Text></View><View style={styles.captureCopy}><Text style={styles.captureTitle}>Capture a learning moment</Text><Text style={styles.captureSubtitle}>An observation, a question, an unexpected discovery.</Text></View><Text style={styles.ideaArrow}>›</Text></Pressable>
    <SectionHeading title="Recently observed" />
    {records.map(record => <View key={record.id} style={styles.journalCard}>
      <View style={[styles.journalAvatar, record.learner === 'Leo' ? styles.avatarLeo : styles.avatarAva]}><Text style={styles.avatarText}>{record.learner[0]}</Text></View>
      <View style={styles.journalContent}>
        <View style={styles.journalMeta}><Text style={styles.journalLearner}>{record.learner}</Text><Text style={styles.metaDot}>·</Text><Text style={styles.journalDate}>{record.happenedAt}</Text></View>
        <Text style={styles.journalNote}>{record.note}</Text>
        <View style={styles.journalTag}><Text style={[styles.journalTagText, { color: subjectColors[record.subject] ?? '#71847a' }]}>{record.subject}</Text><Text style={styles.journalTagText}> · {record.familyExperience ?? record.activityTitle}</Text></View>
        {record.lessonId ? <View style={styles.journalLessonLink}><Text style={styles.journalLessonLinkText}>K–12 lesson · {demoLessons.find(lesson => lesson.id === record.lessonId)?.title}</Text></View> : null}
      </View>
    </View>)}
    <View style={styles.privacyCard}><Text style={styles.privacyIcon}>⌑</Text><Text style={styles.privacyText}>Your journal belongs to your family. These prototype notes are only held on this screen.</Text></View>
  </View>;
}

function ProgressTab({ learnerFilter, setLearnerFilter, recordCount }: {
  readonly learnerFilter: 'All learners' | DemoLearner;
  readonly setLearnerFilter: (value: 'All learners' | DemoLearner) => void;
  readonly recordCount: number;
}) {
  const learnerName = learnerFilter === 'All learners' ? 'Your learners' : learnerFilter;
  const progressAreas = [
    { title: 'Language & stories', subject: 'Literacy', label: 'Collecting observations', count: 6, color: subjectColors.Literacy },
    { title: 'Patterns & numbers', subject: 'Mathematics', label: 'Exploring together', count: 4, color: subjectColors.Mathematics },
    { title: 'Living world', subject: 'Nature study', label: 'A goal was demonstrated', count: 5, color: subjectColors['Nature study'] },
    { title: 'Making & imagining', subject: 'Creative arts', label: 'Collecting observations', count: 3, color: subjectColors['Creative arts'] },
  ];
  return <View>
    <View style={styles.pageTitleRow}><View><Text style={styles.eyebrow}>GROWTH OVER TIME</Text><Text accessibilityRole="header" style={styles.pageTitle}>Progress</Text></View><View style={styles.progressFlower}><Text style={styles.progressFlowerText}>✳</Text></View></View>
    <View style={styles.learnerChips}>{(['All learners', ...learners] as const).map(learner => <Chip key={learner} label={learner} selected={learnerFilter === learner} onPress={() => setLearnerFilter(learner)} />)}</View>
    <View style={styles.progressIntro}><Text style={styles.progressIntroTitle}>{learnerName} are learning in many ways.</Text><Text style={styles.progressIntroText}>Look across plans, observations and parent assessments. There’s no single score that tells the whole story.</Text></View>
    <View style={styles.progressSummary}>
      <View style={styles.summaryMetric}><Text style={styles.summaryNumber}>12</Text><Text style={styles.summaryLabel}>activities planned</Text></View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryMetric}><Text style={styles.summaryNumber}>{recordCount + 5}</Text><Text style={styles.summaryLabel}>moments observed</Text></View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryMetric}><Text style={styles.summaryNumber}>3</Text><Text style={styles.summaryLabel}>goals assessed</Text></View>
    </View>
    <SectionHeading title="Learning areas" />
    {progressAreas.map(area => <View key={area.subject} style={styles.progressArea}>
      <View style={[styles.progressAreaIcon, { backgroundColor: `${area.color}22` }]}><Text style={[styles.progressAreaInitial, { color: area.color }]}>{area.subject[0]}</Text></View>
      <View style={styles.progressAreaMain}>
        <View style={styles.progressAreaTop}><Text style={styles.progressAreaTitle}>{area.title}</Text><Text style={styles.progressAreaCount}>{area.count} moments</Text></View>
        <View style={styles.progressAreaTrack}><View style={[styles.progressAreaFill, { backgroundColor: area.color, width: `${Math.min(100, area.count * 12)}%` }]} /></View>
        <Text style={styles.progressAreaStatus}>{area.label}</Text>
      </View>
    </View>)}
    <View style={styles.assessmentHint}><Text style={styles.assessmentHintIcon}>◎</Text><View><Text style={styles.assessmentHintTitle}>Assessment stays in your hands</Text><Text style={styles.assessmentHintText}>A completed activity is different from a goal demonstrated. You decide when progress has been shown.</Text></View></View>
  </View>;
}

function TabButton({ icon, title, active, onPress }: { readonly icon: string; readonly title: string; readonly active: boolean; readonly onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.tabButton}>
    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{title}</Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#f7f6f0' },
  scrollContent: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 26, gap: 0 },
  pageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandMark: { width: 31, height: 31, borderRadius: 11, backgroundColor: '#22473e', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#f3efe2', fontFamily: 'Georgia', fontSize: 23, lineHeight: 28, fontWeight: '700' },
  brandName: { color: '#24453d', fontFamily: 'Georgia', fontSize: 20, letterSpacing: -0.6, fontWeight: '600' },
  prototypePill: { backgroundColor: '#e9eee5', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4, marginLeft: 3 },
  prototypePillText: { color: '#65806e', fontSize: 8, letterSpacing: 1.1, fontWeight: '800' },
  apiButton: { paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#dce1d8', borderRadius: 11 },
  apiButtonText: { color: '#66806f', fontSize: 11, fontWeight: '700' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  eyebrow: { color: '#89978d', fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 6 },
  greeting: { color: '#253f37', fontFamily: 'Georgia', fontSize: 27, letterSpacing: -0.8, fontWeight: '600' },
  greetingSub: { color: '#7e8980', fontSize: 12, marginTop: 5 },
  parentAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#e7d7c6', alignItems: 'center', justifyContent: 'center' },
  parentAvatarText: { color: '#886c55', fontFamily: 'Georgia', fontSize: 17, fontWeight: '700' },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modeLabel: { color: '#89978d', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  modePicker: { flexDirection: 'row', backgroundColor: '#eceee7', borderRadius: 10, padding: 3 },
  modeOption: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7 },
  modeOptionActive: { backgroundColor: '#fff', shadowColor: '#37463b', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  modeOptionText: { color: '#879187', fontSize: 10, fontWeight: '600' },
  modeOptionTextActive: { color: '#36594b' },
  savedToast: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e7efe6', borderRadius: 12, padding: 12, marginBottom: 15 },
  savedToastText: { color: '#476c54', fontSize: 12, fontWeight: '600' },
  toastDismiss: { color: '#668270', fontSize: 19 },
  learnerChips: { flexDirection: 'row', gap: 7, marginBottom: 16, flexWrap: 'wrap' },
  chip: { borderColor: '#dce1d8', borderWidth: 1, backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 13, paddingVertical: 8 },
  chipSelected: { borderColor: '#375c4c', backgroundColor: '#375c4c' },
  chipText: { color: '#77847a', fontSize: 11, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  weekCard: { backgroundColor: '#284d42', borderRadius: 21, padding: 19, marginBottom: 18, overflow: 'hidden' },
  weekCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  weekKicker: { color: '#bdcebf', fontSize: 9, letterSpacing: 1.15, fontWeight: '800' },
  weekTitle: { color: '#fffaf0', fontFamily: 'Georgia', fontSize: 24, letterSpacing: -0.5, fontWeight: '600', marginTop: 9 },
  weekArrow: { color: '#bfd3c3', fontSize: 20 },
  weekCopy: { color: '#d2dfd3', fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 275 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18, marginBottom: 8 },
  progressCount: { color: '#fffaf0', fontSize: 17, fontWeight: '700' },
  progressTotal: { color: '#bdcebf', fontSize: 11, fontWeight: '500' },
  progressHint: { color: '#bdcebf', fontSize: 10 },
  progressTrack: { height: 6, borderRadius: 4, backgroundColor: '#45685a', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: '#e7ba84' },
  weekDots: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  weekDot: { height: 4, width: 22, borderRadius: 4, backgroundColor: '#446456' },
  weekDotActive: { backgroundColor: '#9cbaa1' },
  weekDotToday: { backgroundColor: '#e7ba84', width: 29 },
  dayStrip: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eeefe8', padding: 5, borderRadius: 15, marginBottom: 22 },
  dayCell: { minWidth: 38, borderRadius: 11, alignItems: 'center', paddingVertical: 8 },
  dayCellSelected: { backgroundColor: '#fff', shadowColor: '#35453b', shadowOpacity: 0.08, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } },
  dayLabel: { color: '#929b90', fontSize: 9, fontWeight: '600' },
  dayNumber: { color: '#4a5f52', fontSize: 13, fontWeight: '700', marginTop: 4 },
  dayTextSelected: { color: '#274d40' },
  dayDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'transparent', marginTop: 5 },
  dayDotFilled: { backgroundColor: '#9fb09c' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 12 },
  sectionTitle: { color: '#2f493e', fontFamily: 'Georgia', fontSize: 18, fontWeight: '600' },
  link: { color: '#718e78', fontSize: 11, fontWeight: '700' },
  activityCard: { flexDirection: 'row', overflow: 'hidden', backgroundColor: '#fff', borderColor: '#eaebe3', borderWidth: 1, borderRadius: 15, marginBottom: 9 },
  activityAccent: { width: 4 },
  activityBody: { flex: 1, paddingHorizontal: 13, paddingVertical: 12 },
  activityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectLabel: { fontSize: 8, letterSpacing: 1.05, fontWeight: '800' },
  activityTime: { color: '#8d968c', fontSize: 10, fontWeight: '600' },
  activityTitle: { color: '#35483c', fontFamily: 'Georgia', fontSize: 16, fontWeight: '600', marginTop: 6 },
  linkedLessonText: { color: '#6b8872', fontSize: 9, fontWeight: '700', marginTop: 4 },
  activityMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  avatars: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 21, height: 21, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  avatarOverlap: { marginLeft: -6 },
  avatarAva: { backgroundColor: '#e9cdbb' },
  avatarLeo: { backgroundColor: '#c6d8c7' },
  avatarText: { color: '#55685a', fontSize: 8, fontWeight: '800' },
  metaText: { color: '#9aa198', fontSize: 10, marginLeft: 7 },
  completeBadge: { color: '#65866c', backgroundColor: '#edf3eb', fontSize: 9, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, marginLeft: 'auto' },
  planBadge: { color: '#9a866f', backgroundColor: '#f6f0e8', fontSize: 9, fontWeight: '700', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 7, marginLeft: 'auto' },
  activityActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0e9', marginTop: 10, paddingTop: 7 },
  logAction: { paddingVertical: 3, paddingRight: 8 },
  logActionText: { color: '#6d8870', fontSize: 10, fontWeight: '700' },
  checkAction: { width: 25, height: 25, alignItems: 'center', justifyContent: 'center' },
  checkActionDone: { backgroundColor: '#e8f0e6', borderRadius: 14 },
  checkActionText: { color: '#9da69b', fontSize: 17 },
  checkActionTextDone: { color: '#5f8767', fontSize: 13, fontWeight: '800' },
  addActivityButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#cdd5ca', borderRadius: 14, paddingVertical: 12, marginTop: 2 },
  addActivityPlus: { color: '#69836f', fontSize: 17, marginRight: 7 },
  addActivityText: { color: '#6f8572', fontSize: 11, fontWeight: '700' },
  ideaCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0e9dd', borderRadius: 16, padding: 14, marginTop: 19, marginBottom: 10 },
  ideaIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#e1d3bd', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  ideaIconText: { color: '#9b7858', fontSize: 17 },
  ideaTextBlock: { flex: 1 },
  ideaKicker: { color: '#a18769', fontSize: 8, letterSpacing: 1, fontWeight: '800' },
  ideaTitle: { color: '#564c3e', fontFamily: 'Georgia', fontSize: 15, fontWeight: '600', marginTop: 5 },
  ideaCopy: { color: '#7a715f', fontSize: 10, lineHeight: 15, marginTop: 4 },
  ideaArrow: { color: '#a38a6d', fontSize: 22, marginLeft: 6 },
  sampleNote: { alignItems: 'center', paddingTop: 14 },
  sampleNoteText: { color: '#a4aaa0', fontSize: 9 },
  emptyCard: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingVertical: 24, paddingHorizontal: 18, gap: 7 },
  emptyText: { color: '#53685a', fontFamily: 'Georgia', fontSize: 16 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e9ebe3', paddingTop: 9, paddingBottom: 25 },
  tabButton: { flex: 1, alignItems: 'center', gap: 3 },
  tabIcon: { color: '#a1aaa0', fontSize: 18, height: 22 },
  tabIconActive: { color: '#3d6952' },
  tabLabel: { color: '#a0a79d', fontSize: 9, fontWeight: '600' },
  tabLabelActive: { color: '#42674f', fontWeight: '800' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 5 },
  pageTitle: { color: '#2b463b', fontFamily: 'Georgia', fontSize: 29, letterSpacing: -0.7, fontWeight: '600' },
  lessonBanner: { backgroundColor: '#e8eee5', borderRadius: 16, padding: 15, marginTop: 16, marginBottom: 18 },
  lessonBannerTitle: { color: '#365144', fontFamily: 'Georgia', fontSize: 17, fontWeight: '600' },
  lessonBannerText: { color: '#758678', fontSize: 10, lineHeight: 15, marginTop: 5 },
  lessonCreateCard: { backgroundColor: '#f0e9dd', borderRadius: 15, padding: 15, marginBottom: 16 },
  lessonCreateTitle: { color: '#4d5544', fontFamily: 'Georgia', fontSize: 16, fontWeight: '600' },
  lessonCreateText: { color: '#7f7869', fontSize: 10, lineHeight: 15, marginTop: 5 },
  lessonCreateAction: { color: '#57725f', fontSize: 10, fontWeight: '800', marginTop: 10 },
  catalogNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0e9dd', borderRadius: 12, padding: 11, marginTop: 14 },
  catalogNoteIcon: { color: '#987e5e', fontSize: 17, marginRight: 8 },
  catalogNoteText: { flex: 1, color: '#857966', fontSize: 9, lineHeight: 14 },
  lessonCard: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#ebede5', padding: 14, marginBottom: 9 },
  lessonCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lessonTag: { color: '#758d78', fontSize: 8, letterSpacing: 0.9, fontWeight: '800' },
  lessonDuration: { color: '#9aa197', fontSize: 9 },
  lessonTitle: { color: '#3d5547', fontFamily: 'Georgia', fontSize: 16, fontWeight: '600', marginTop: 8 },
  lessonFocus: { color: '#7d897e', fontSize: 10, marginTop: 4 },
  lessonCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0e9' },
  lessonLevel: { color: '#9a9f94', fontSize: 9 },
  lessonArrow: { color: '#6b8a71', fontSize: 20 },
  lessonBody: { flex: 1, color: '#68766a', fontSize: 11, lineHeight: 16 },
  lessonStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, marginVertical: 3 },
  lessonStepNumber: { color: '#66816b', backgroundColor: '#e9efe6', overflow: 'hidden', borderRadius: 10, textAlign: 'center', textAlignVertical: 'center', width: 21, height: 21, fontSize: 10, fontWeight: '800' },
  customSubjectCard: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#ebede5', padding: 14, marginBottom: 8 },
  customSubjectRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  customSubjectInput: { flex: 1 },
  customSubjectButton: { backgroundColor: '#315b4a', borderRadius: 11, paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },
  customSubjectButtonText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  customSubjectList: { color: '#78907c', fontSize: 9, marginTop: 9 },
  catalogueViewToggle: { flexDirection: 'row', backgroundColor: '#eceee7', borderRadius: 12, padding: 3, marginTop: 10, marginBottom: 14 },
  catalogueViewOption: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 9 },
  catalogueViewOptionSelected: { backgroundColor: '#fff' },
  catalogueViewText: { color: '#879187', fontSize: 10, fontWeight: '600' },
  catalogueViewTextSelected: { color: '#36594b' },
  coverageNotice: { backgroundColor: '#f0e9dd', borderRadius: 14, padding: 13, marginBottom: 12 },
  coverageNoticeTitle: { color: '#635440', fontFamily: 'Georgia', fontSize: 16, fontWeight: '600', marginBottom: 5 },
  coverageCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#ebede5', padding: 12, marginBottom: 8 },
  coverageCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  coverageStatus: { color: '#987e5e', backgroundColor: '#f6f0e8', borderRadius: 8, overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 5, fontSize: 8, fontWeight: '800' },
  coverageStatusReview: { color: '#6f7657', backgroundColor: '#edf1e5' },
  coverageCounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  lessonPreviewScroll: { flexGrow: 0, maxHeight: '70%' },
  lessonPreviewContent: { gap: 8, paddingBottom: 8 },
  recordFormScroll: { flexGrow: 0, maxHeight: '70%' },
  recordFormContent: { gap: 9, paddingBottom: 8 },
  lessonProvenance: { color: '#8a9589', fontSize: 9, lineHeight: 14, marginTop: 5 },
  familyExperiencePanel: { backgroundColor: '#e8eee5', borderRadius: 13, padding: 12, gap: 8, marginTop: 6 },
  familyExperienceTitle: { color: '#365144', fontFamily: 'Georgia', fontSize: 15, fontWeight: '600' },
  familyExperienceHint: { color: '#758678', fontSize: 10, lineHeight: 14 },
  familyExperienceButton: { borderWidth: 1, borderColor: '#c8d4c8', borderRadius: 13, alignItems: 'center', paddingVertical: 12, marginTop: -5 },
  familyExperienceButtonDisabled: { opacity: 0.5 },
  familyExperienceButtonText: { color: '#56775e', fontSize: 11, fontWeight: '800' },
  roundAdd: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#315b4a', alignItems: 'center', justifyContent: 'center' },
  roundAddText: { color: '#fff', fontSize: 22, lineHeight: 25 },
  weekRange: { color: '#89938a', fontSize: 11, marginBottom: 17 },
  planDateHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 },
  planDateTitle: { color: '#365144', fontFamily: 'Georgia', fontSize: 18, fontWeight: '600' },
  planDateSubtitle: { color: '#9aa197', fontSize: 10 },
  plannerAdd: { alignItems: 'center', backgroundColor: '#e9eee6', borderRadius: 13, paddingVertical: 13, marginTop: 4 },
  plannerAddText: { color: '#56775e', fontSize: 12, fontWeight: '700' },
  plannerNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0e9dd', padding: 13, borderRadius: 13, marginTop: 17 },
  plannerNoteIcon: { color: '#a48461', fontSize: 18, marginRight: 8 },
  plannerNoteText: { flex: 1, color: '#7d725f', fontSize: 10, lineHeight: 15 },
  captureCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8eee5', borderRadius: 16, padding: 14, marginTop: 3, marginBottom: 22 },
  captureIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#d4e1d2', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  captureIconText: { color: '#5a7d64', fontSize: 18 },
  captureCopy: { flex: 1 },
  captureTitle: { color: '#385741', fontSize: 12, fontWeight: '700' },
  captureSubtitle: { color: '#7b897b', fontSize: 9, lineHeight: 13, marginTop: 3 },
  journalCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 15, padding: 14, marginBottom: 9, borderWidth: 1, borderColor: '#ebede5' },
  journalAvatar: { width: 31, height: 31, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  journalContent: { flex: 1 },
  journalMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  journalLearner: { color: '#516755', fontSize: 10, fontWeight: '800' },
  metaDot: { color: '#b2b8ae', fontSize: 11 },
  journalDate: { color: '#a0a69d', fontSize: 9 },
  journalNote: { color: '#4c584f', fontFamily: 'Georgia', fontSize: 14, lineHeight: 20, marginTop: 8 },
  journalTag: { flexDirection: 'row', marginTop: 9 },
  journalTagText: { color: '#89938a', fontSize: 9, fontWeight: '600' },
  journalLessonLink: { alignSelf: 'flex-start', backgroundColor: '#e9efe6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, marginTop: 7 },
  journalLessonLinkText: { color: '#5e7b64', fontSize: 9, fontWeight: '700' },
  privacyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eeefe8', borderRadius: 12, padding: 12, marginTop: 7 },
  privacyIcon: { color: '#7a8c7b', fontSize: 19, marginRight: 9 },
  privacyText: { flex: 1, color: '#839084', fontSize: 9, lineHeight: 14 },
  progressFlower: { width: 41, height: 41, borderRadius: 14, backgroundColor: '#efe8da', alignItems: 'center', justifyContent: 'center' },
  progressFlowerText: { color: '#a78b67', fontSize: 21 },
  progressIntro: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 2, marginBottom: 11 },
  progressIntroTitle: { color: '#385044', fontFamily: 'Georgia', fontSize: 17, fontWeight: '600' },
  progressIntroText: { color: '#838e83', fontSize: 10, lineHeight: 15, marginTop: 6 },
  progressSummary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#2c5145', borderRadius: 16, paddingVertical: 15, marginBottom: 20 },
  summaryMetric: { flex: 1, alignItems: 'center', gap: 3 },
  summaryNumber: { color: '#fff8ea', fontFamily: 'Georgia', fontSize: 21, fontWeight: '600' },
  summaryLabel: { color: '#c4d3c3', fontSize: 8, textAlign: 'center' },
  summaryDivider: { width: 1, height: 29, backgroundColor: '#527062' },
  progressArea: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 8 },
  progressAreaIcon: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  progressAreaInitial: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '700' },
  progressAreaMain: { flex: 1 },
  progressAreaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  progressAreaTitle: { color: '#49584d', fontFamily: 'Georgia', fontSize: 13, fontWeight: '600' },
  progressAreaCount: { color: '#a0a69c', fontSize: 8 },
  progressAreaTrack: { height: 4, backgroundColor: '#eef0e9', borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  progressAreaFill: { height: '100%', borderRadius: 3 },
  progressAreaStatus: { color: '#9a9f94', fontSize: 8, marginTop: 5 },
  assessmentHint: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0e9dd', borderRadius: 14, padding: 13, marginTop: 8, marginBottom: 8 },
  assessmentHintIcon: { color: '#987e5e', fontSize: 20, marginRight: 9 },
  assessmentHintTitle: { color: '#635440', fontSize: 10, fontWeight: '800' },
  assessmentHintText: { color: '#857966', fontSize: 9, lineHeight: 14, marginTop: 4 },
  modalRoot: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(30, 47, 39, 0.35)' },
  modalBackdrop: { ...StyleSheet.absoluteFill },
  sheet: { width: '100%', maxWidth: 600, maxHeight: '90%', alignSelf: 'center', backgroundColor: '#faf9f4', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, borderTopLeftRadius: 25, borderTopRightRadius: 25, borderRadius: 25, gap: 10 },
  sheetHandle: { alignSelf: 'center', width: 37, height: 4, borderRadius: 2, backgroundColor: '#d6dbd2', marginBottom: 4 },
  sheetHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  sheetTitle: { color: '#304b3e', fontFamily: 'Georgia', fontSize: 22, fontWeight: '600' },
  sheetClose: { color: '#89968b', fontSize: 26, paddingHorizontal: 5 },
  formLabel: { color: '#8d988d', fontSize: 8, fontWeight: '800', letterSpacing: 1.1, marginTop: 5 },
  formInput: { borderWidth: 1, borderColor: '#dfe3db', borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 13, paddingVertical: 12, color: '#405247', fontSize: 12 },
  observationInput: { height: 98, textAlignVertical: 'top' },
  choiceRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 2 },
  scheduleFormRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e8e9e2', paddingTop: 11, marginTop: 4 },
  scheduleSub: { color: '#9ca49a', fontSize: 9, marginTop: 3 },
  timePreview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eff2eb', borderRadius: 10, padding: 10 },
  timePreviewIcon: { color: '#789079', fontSize: 16, marginRight: 8 },
  timePreviewText: { color: '#6e806f', fontSize: 10, fontWeight: '600' },
  formHelper: { color: '#8b958a', fontSize: 11, marginTop: -4, marginBottom: 2 },
  linkedActivity: { color: '#879187', fontSize: 10 },
  selectedLessonLink: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e9efe6', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  selectedLessonLinkText: { color: '#5e7b64', fontSize: 10, fontWeight: '700', flex: 1 },
  lessonPickerButton: { alignSelf: 'flex-start', paddingVertical: 5 },
  lessonPickerButtonText: { color: '#6b8872', fontSize: 10, fontWeight: '700' },
  recordLessonPicker: { maxHeight: 140, borderWidth: 1, borderColor: '#e1e5dc', borderRadius: 10, backgroundColor: '#fff' },
  recordLessonOption: { paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f1eb' },
  recordLessonTitle: { color: '#3d5547', fontSize: 11, fontWeight: '700' },
  recordLessonSubject: { color: '#89938a', fontSize: 9, marginTop: 2 },
  separationNote: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f0e9dd', borderRadius: 12, padding: 11, marginTop: 2 },
  separationIcon: { color: '#9e805d', fontSize: 15, marginRight: 8 },
  separationText: { flex: 1, color: '#7d725f', fontSize: 9, lineHeight: 14 },
  primaryButton: { backgroundColor: '#315b4a', borderRadius: 13, alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  primaryButtonDisabled: { opacity: 0.45 },
  primaryButtonText: { color: '#fffaf0', fontSize: 12, fontWeight: '800' },
});
