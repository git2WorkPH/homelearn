export type Tab = 'home' | 'lessons' | 'planner' | 'journal' | 'progress';
export type Mode = 'Guided' | 'Independent';
export type DemoLearner = 'Eli' | 'Khael';
export type DemoActivity = {
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
export type DemoRecord = {
  readonly id: string;
  readonly learner: DemoLearner;
  readonly activityTitle: string;
  readonly subject: string;
  readonly note: string;
  readonly happenedAt: string;
  readonly lessonId?: string;
  readonly familyExperience?: string;
};
export type DemoLesson = { readonly id: string; readonly title: string; readonly subject: string; readonly strand: string; readonly focus: string; readonly learningGoal: string; readonly materials: readonly string[]; readonly adaptation: string; readonly duration: string; readonly description: string; readonly steps: readonly string[]; readonly provenance: string; readonly version: string; readonly reviewStatus: string };

export const learners: readonly DemoLearner[] = ['Eli', 'Khael'];
export const subjects = ['Literacy', 'Mathematics', 'Nature study', 'Creative arts', 'Movement'];
const todayOffset = (new Date().getDay() + 6) % 7;
export const initialActivities: readonly DemoActivity[] = [
  { id: 'read-aloud', title: 'Morning read-aloud', subject: 'Literacy', learnerIds: ['Eli', 'Khael'], startTime: '9:00', duration: '20 min', dayOffset: todayOffset, isComplete: true },
  { id: 'seed-detectives', title: 'Seed detectives', subject: 'Nature study', learnerIds: ['Eli', 'Khael'], startTime: '10:30', duration: '35 min', dayOffset: todayOffset, isComplete: false },
  { id: 'cardboard-city', title: 'Build a cardboard city', subject: 'Creative arts', learnerIds: ['Eli'], duration: 'Flexible', dayOffset: todayOffset, isComplete: false },
  { id: 'number-garden', title: 'Number garden', subject: 'Mathematics', learnerIds: ['Khael'], startTime: '13:30', duration: '25 min', dayOffset: Math.min(todayOffset + 1, 6), isComplete: false },
  { id: 'story-walk', title: 'Story walk', subject: 'Movement', learnerIds: ['Eli', 'Khael'], startTime: '10:00', duration: '30 min', dayOffset: Math.min(todayOffset + 2, 6), isComplete: false },
];
export const initialRecords: readonly DemoRecord[] = [
  { id: 'note-1', learner: 'Eli', activityTitle: 'Morning read-aloud', subject: 'Literacy', note: 'Paused to predict what the character might do next.', happenedAt: 'Today · 9:24 am' },
  { id: 'note-2', learner: 'Khael', activityTitle: 'Seed detectives', subject: 'Nature study', note: 'Sorted the seeds by shape, then noticed two had the same colour.', happenedAt: 'Yesterday · 11:10 am' },
  { id: 'note-3', learner: 'Eli', activityTitle: 'Cardboard city', subject: 'Creative arts', note: 'Changed the design after testing how the bridge held weight.', happenedAt: 'Yesterday · 2:05 pm' },
];
export const subjectColors: Record<string, string> = {
  Literacy: '#d7825d',
  Mathematics: '#7584a7',
  'Nature study': '#73937a',
  'Creative arts': '#b18b68',
  Movement: '#82a8a0',
};
export const learningLevels = ['Kindergarten', ...Array.from({ length: 12 }, (_, index) => `Year ${index + 1}`)];
export const lessonSubjects = ['English', 'Mathematics', 'Science', 'Humanities & social sciences', 'Technologies', 'The arts', 'Health & physical education', 'Languages', 'Cross-curricular', 'Family-defined'];
export const lessonCoverageExamples = [
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
export const demoLessons: readonly DemoLesson[] = [
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

export function createWeekDays(): readonly { readonly label: string; readonly date: number; readonly fullDate: string }[] {
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

export function shortWeekLabel(days: ReturnType<typeof createWeekDays>): string {
  const monday = startOfWeek(new Date());
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const month = monday.toLocaleDateString('en-AU', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-AU', { month: 'short' });
  return `${days[0]?.date} ${month} – ${days[6]?.date} ${endMonth}`;
}
