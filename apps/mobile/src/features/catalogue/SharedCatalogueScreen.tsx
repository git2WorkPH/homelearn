import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, Button, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  familyId,
  id,
  learnerId,
  request,
  type Activity,
  type CatalogueCoverageCell,
  type CatalogueLesson,
  type CatalogueResponse,
  type Plan,
} from '../../services/homelearn-api';

export function SharedCatalogueScreen({ onClose }: { readonly onClose: () => void }) {
  const [lessons, setLessons] = useState<CatalogueLesson[]>([]);
  const [coverage, setCoverage] = useState<CatalogueCoverageCell[]>([]);
  const [pack, setPack] = useState<CatalogueResponse['pack']>();
  const [level, setLevel] = useState('kindergarten');
  const [area, setArea] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CatalogueLesson>();
  const [activityTitle, setActivityTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const loadCatalogue = useCallback(async () => {
    setLoading(true);
    try {
      const [catalogue, coverageResponse] = await Promise.all([
        request<CatalogueResponse>('/api/v1/catalogue/lessons', undefined, 'GET'),
        request<{ cells: CatalogueCoverageCell[] }>('/api/v1/catalogue/coverage', undefined, 'GET'),
      ]);
      setLessons(catalogue.items);
      setCoverage(coverageResponse.cells);
      setPack(catalogue.pack);
      setMessage('');
    } catch {
      setMessage('Start the local HomeLearn API to browse the shared lesson catalogue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void loadCatalogue(); }, 0);
    return () => clearTimeout(timer);
  }, [loadCatalogue]);

  const levels = useMemo(() => coverage.filter((cell, index, all) => all.findIndex(item => item.levelKey === cell.levelKey) === index), [coverage]);
  const areas = useMemo(() => coverage.filter((cell, index, all) => all.findIndex(item => item.learningAreaKey === cell.learningAreaKey) === index), [coverage]);
  const visibleLessons = useMemo(() => lessons
    .filter(lesson => lesson.levelKey === level && (area === 'all' || lesson.learningAreaKey === area))
    .filter(lesson => `${lesson.title} ${lesson.strand} ${lesson.summary} ${lesson.learningGoal}`.toLocaleLowerCase('en-AU').includes(search.trim().toLocaleLowerCase('en-AU')))
    .sort((left, right) => left.learningArea.localeCompare(right.learningArea) || left.strand.localeCompare(right.strand) || left.title.localeCompare(right.title)),
  [area, lessons, level, search]);
  const selectedCoverage = coverage.find(cell => cell.levelKey === level && cell.learningAreaKey === area);

  const addToPlan = async () => {
    if (selected === undefined) return;
    setBusy(true);
    try {
      const plans = await request<Plan[]>('/api/v1/plans', undefined, 'GET');
      let plan = plans.find(item => item.status === 'active') ?? plans.find(item => item.status === undefined);
      if (plan === undefined) {
        const start = new Date();
        start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        plan = await request<Plan>('/api/v1/plans', {
          id: id(), familyId, title: 'Learning this week',
          startsOn: start.toISOString().slice(0, 10), endsOn: end.toISOString().slice(0, 10), status: 'active',
        });
      }
      const title = activityTitle.trim() || selected.title;
      await request<Activity>('/api/v1/activities', {
        id: id(), familyId, planId: plan.id, title, learnerIds: [learnerId], catalogLessonRef: selected.reference,
      });
      setMessage(`Added “${title}” to the weekly plan.`);
      setSelected(undefined);
      setActivityTitle('');
    } catch {
      setMessage('Could not add this lesson to the weekly plan. Check the local API.');
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.backButton}><Text style={styles.backText}>‹  Lessons</Text></Pressable>
      <Text accessibilityRole="header" style={styles.title}>HomeLearn lessons</Text>
      <Text style={styles.intro}>Choose a level and learning area, explore an original starter lesson, and adapt it to your family.</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.packLabel}>BIBLE-INSPIRED K–3 STARTER PACK · {pack?.totalLessons ?? '…'} LESSONS</Text>
      <Text style={styles.body}>HomeLearn original lessons. Bible reflections accompany the subject learning; parent choices remain in control. NSW syllabus mapping is not included.</Text>
      {message ? <View accessibilityRole="alert" style={styles.notice}><Text style={styles.noticeText}>{message}</Text>{!loading ? <Button title="Try again" onPress={() => void loadCatalogue()} /> : null}</View> : null}
      <Text style={styles.filterLabel}>1 · CHOOSE A LEVEL</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {levels.slice(0, 4).map(item => <Pressable key={item.levelKey} accessibilityRole="button" accessibilityState={{ selected: level === item.levelKey }} onPress={() => { setLevel(item.levelKey); setSelected(undefined); }} style={[styles.chip, level === item.levelKey && styles.chipSelected]}>
          <Text style={[styles.chipText, level === item.levelKey && styles.chipTextSelected]}>{item.levelLabel}</Text>
        </Pressable>)}
      </ScrollView>
      <Text style={styles.filterLabel}>2 · CHOOSE A LEARNING AREA</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <FilterChip label="All areas" selected={area === 'all'} onPress={() => { setArea('all'); setSelected(undefined); }} />
        {areas.filter(item => item.learningAreaKey !== 'languages').map(item => <FilterChip key={item.learningAreaKey} label={item.learningArea} selected={area === item.learningAreaKey} onPress={() => { setArea(item.learningAreaKey); setSelected(undefined); }} />)}
      </ScrollView>
      <TextInput accessibilityLabel="Search lesson topics" style={styles.search} placeholder="3 · Search lessons or topics" value={search} onChangeText={setSearch} />
      {selectedCoverage ? <Text style={styles.coverage}>{selectedCoverage.status === 'needs-parent-review'
        ? `${selectedCoverage.draftLessonCount} lessons in this area · ${selectedCoverage.reviewedLessonCount} marked reviewed`
        : `No shared starter lessons for ${selectedCoverage.levelLabel} ${selectedCoverage.learningArea} yet.`}</Text> : null}
      {loading ? <ActivityIndicator accessibilityLabel="Loading lessons" color="#285b4e" /> : visibleLessons.length === 0
        ? <View style={styles.empty}><Text style={styles.emptyTitle}>No matching topics</Text><Text style={styles.body}>Try another learning area or search phrase. Gaps in this starter pack are shown rather than filled with assumptions.</Text></View>
        : <>
          <Text style={styles.results}>{visibleLessons.length} {visibleLessons.length === 1 ? 'topic' : 'topics'} · {levels.find(item => item.levelKey === level)?.levelLabel ?? 'Selected level'}</Text>
          {visibleLessons.map(lesson => <Pressable key={lesson.reference} accessibilityRole="button" accessibilityState={{ selected: selected?.reference === lesson.reference }} onPress={() => { setSelected(lesson); setActivityTitle(lesson.title); }} style={[styles.topicCard, selected?.reference === lesson.reference && styles.topicSelected]}>
            <Text style={styles.topicMeta}>{lesson.learningArea}  ·  {lesson.strand}</Text>
            <Text style={styles.topicTitle}>{lesson.title}</Text>
            <Text style={styles.body}>{lesson.summary}</Text>
            <View style={styles.topicFooter}><Text style={styles.topicTime}>{lesson.estimatedMinutes} min</Text><Text style={styles.topicAction}>Open lesson ›</Text></View>
          </Pressable>)}
        </>}
      {selected ? <View style={styles.guide}>
        <Text style={styles.guideKicker}>LESSON GUIDE · {selected.levelLabel.toUpperCase()}</Text>
        <Text accessibilityRole="header" style={styles.guideTitle}>{selected.title}</Text>
        <Text style={styles.body}>{selected.learningArea} · {selected.strand} · {selected.estimatedMinutes} minutes</Text>
        <GuideSection title="Learning goal"><Text style={styles.body}>{selected.learningGoal}</Text></GuideSection>
        <GuideSection title="What to look for">{selected.successCriteria.map(item => <Text key={item} style={styles.body}>• {item}</Text>)}</GuideSection>
        <GuideSection title="Gather">{selected.materials.map(item => <Text key={item} style={styles.body}>• {item}</Text>)}</GuideSection>
        <GuideSection title="Try it together">{selected.steps.map((item, index) => <Text key={`${index}-${item}`} style={styles.body}>{index + 1}. {item}</Text>)}</GuideSection>
        <GuideSection title="Adapt and extend"><Text style={styles.body}>Support · {selected.support}</Text><Text style={styles.body}>Extension · {selected.extension}</Text></GuideSection>
        <GuideSection title="Ask or wonder"><Text style={styles.body}>{selected.parentPrompt}</Text></GuideSection>
        <View style={styles.faithCard}><Text style={styles.guideSectionTitle}>BIBLE CONNECTION · {selected.bibleConnection.reference}</Text><Text style={styles.body}>{selected.bibleConnection.paraphrase}</Text><Text style={styles.body}>{selected.bibleConnection.reflectionPrompt}</Text><Text style={styles.caption}>Original child-friendly paraphrase; no translation wording is quoted. This reflection is separate from subject facts and goals.</Text></View>
        <GuideSection title="Safety and access"><Text style={styles.body}>{selected.safetyAndAccess}</Text></GuideSection>
        <Text style={styles.caption}>Original HomeLearn content · {selected.packId}@{selected.packVersion} · shared lesson reference is preserved in the plan.</Text>
        <TextInput accessibilityLabel="Family activity title" style={styles.search} value={activityTitle} onChangeText={setActivityTitle} placeholder="Name the activity for your family" />
        <Button title={busy ? 'Adding to plan…' : 'Add lesson to weekly plan'} disabled={busy} onPress={() => void addToPlan()} />
        <Text style={styles.caption}>Adding a lesson creates a planned activity. Completion does not mark a learning goal as mastered.</Text>
      </View> : null}
    </ScrollView>
  </SafeAreaView>;
}

function FilterChip({ label, selected, onPress }: { readonly label: string; readonly selected: boolean; readonly onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>;
}

function GuideSection({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return <View style={styles.guideSection}><Text style={styles.guideSectionTitle}>{title.toUpperCase()}</Text>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5ef' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e3e6df', gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 5, paddingRight: 12 },
  backText: { color: '#285b4e', fontSize: 16, fontWeight: '700' },
  title: { color: '#183e36', fontSize: 28, fontWeight: '700' },
  intro: { color: '#52645c', fontSize: 15, lineHeight: 22 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: 20, paddingBottom: 44, gap: 12 },
  packLabel: { color: '#806541', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  body: { color: '#253b36', fontSize: 15, lineHeight: 22 },
  filterLabel: { color: '#52645c', fontSize: 11, fontWeight: '800', letterSpacing: 1, marginTop: 5 },
  chips: { flexDirection: 'row', gap: 8, paddingVertical: 3 },
  chip: { borderWidth: 1, borderColor: '#9ba8a2', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff' },
  chipSelected: { backgroundColor: '#285b4e', borderColor: '#285b4e' },
  chipText: { color: '#37524a', fontSize: 13 },
  chipTextSelected: { color: '#fff' },
  search: { borderWidth: 1, borderColor: '#87958f', borderRadius: 9, padding: 12, backgroundColor: '#fff', color: '#183e36' },
  coverage: { color: '#52645c', fontSize: 13, fontWeight: '600' },
  results: { color: '#52645c', fontSize: 13, fontWeight: '700', marginTop: 4 },
  topicCard: { padding: 14, borderRadius: 11, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e4dd', gap: 5 },
  topicSelected: { borderColor: '#4f7b66', borderWidth: 2 },
  topicMeta: { color: '#678371', fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  topicTitle: { color: '#183e36', fontSize: 18, fontWeight: '700' },
  topicFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  topicTime: { color: '#68756d', fontSize: 12 },
  topicAction: { color: '#285b4e', fontSize: 13, fontWeight: '700' },
  guide: { padding: 16, borderRadius: 13, backgroundColor: '#fff', gap: 12, marginTop: 5 },
  guideKicker: { color: '#806541', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  guideTitle: { color: '#183e36', fontSize: 24, fontWeight: '700' },
  guideSection: { gap: 5 },
  guideSectionTitle: { color: '#52645c', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  faithCard: { padding: 13, borderRadius: 10, backgroundColor: '#f2eadc', gap: 7 },
  caption: { color: '#68756d', fontSize: 12, lineHeight: 18 },
  notice: { padding: 12, borderRadius: 9, backgroundColor: '#f2eadc' },
  noticeText: { color: '#69573d', fontSize: 14, lineHeight: 20 },
  empty: { padding: 16, borderRadius: 10, backgroundColor: '#fff', gap: 5 },
  emptyTitle: { color: '#183e36', fontSize: 18, fontWeight: '700' },
});
