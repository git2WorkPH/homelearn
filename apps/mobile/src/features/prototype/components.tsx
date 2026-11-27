import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import {
  createWeekDays,
  demoLessons,
  learners,
  lessonCoverageExamples,
  learningLevels,
  lessonSubjects,
  shortWeekLabel,
  subjectColors,
  type DemoActivity,
  type DemoLearner,
  type DemoLesson,
  type DemoRecord,
  type Mode,
} from './data';
import { styles } from './styles';

export function Chip({ label, selected, onPress }: { readonly label: string; readonly selected: boolean; readonly onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </Pressable>;
}

export function SectionHeading({ title, action, onAction }: { readonly title: string; readonly action?: string; readonly onAction?: () => void }) {
  return <View style={styles.sectionHeading}>
    <Text accessibilityRole="header" style={styles.sectionTitle}>{title}</Text>
    {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction}><Text style={styles.link}>{action}</Text></Pressable> : null}
  </View>;
}

export function LearnerAvatars({ names }: { readonly names: readonly DemoLearner[] }) {
  return <View style={styles.avatars}>
    {names.map((name, index) => <View key={name} style={[styles.avatar, index > 0 && styles.avatarOverlap, name === 'Khael' ? styles.avatarLeo : styles.avatarAva]}>
      <Text style={styles.avatarText}>{name[0]}</Text>
    </View>)}
  </View>;
}

export function ActivityCard({ activity, onToggle, onLog }: { readonly activity: DemoActivity; readonly onToggle: () => void; readonly onLog: () => void }) {
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

export function HomeTab({ mode, learnerFilter, setLearnerFilter, weekDays, selectedDay, onChooseDay, activities, onToggleComplete, onLog, onAddActivity, onOpenPlanner }: {
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

export function PlannerTab({ weekDays, selectedDay, selectedDate, onChooseDay, learnerFilter, setLearnerFilter, activities, onToggleComplete, onLog, onAddActivity }: {
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

export function LessonsTab({ selectedLevel, onSelectLevel, view, onSelectView, selectedSubject, onSelectSubject, search, onSearch, lessons, customSubjects, customSubject, onCustomSubjectChange, onAddCustomSubject, onOpenLesson, onOpenLessonWorkshop, onOpenCatalogue }: {
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
  readonly onOpenCatalogue: () => void;
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
    <Pressable accessibilityRole="button" onPress={onOpenCatalogue} style={styles.lessonCreateCard}>
      <Text style={styles.lessonCreateTitle}>Browse the starter catalogue</Text>
      <Text style={styles.lessonCreateText}>Explore 56 original Kindergarten–Year 3 lesson drafts, see K–12 coverage gaps and use a selected lesson in your plan.</Text>
      <Text style={styles.lessonCreateAction}>Open shared lesson library ›</Text>
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

export function CoverageView({ level }: { readonly level: string }) {
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

export function JournalTab({ records, learnerFilter, setLearnerFilter, onAdd }: {
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
      <View style={[styles.journalAvatar, record.learner === 'Khael' ? styles.avatarLeo : styles.avatarAva]}><Text style={styles.avatarText}>{record.learner[0]}</Text></View>
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

export function ProgressTab({ learnerFilter, setLearnerFilter, recordCount }: {
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

export function TabButton({ icon, title, active, onPress }: { readonly icon: string; readonly title: string; readonly active: boolean; readonly onPress: () => void }) {
  return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={styles.tabButton}>
    <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{title}</Text>
  </Pressable>;
}
