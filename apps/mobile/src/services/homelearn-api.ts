const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';
export const learnerId = 'learner-a';
export const familyId = 'local-demo';
export const assessmentJudgements = ['emerging', 'developing', 'demonstrated', 'not-assessed'] as const;

export type Judgement = typeof assessmentJudgements[number];
export type Plan = {
  id: string;
  title: string;
  startsOn: string;
  endsOn: string;
};

export type Schedule = {
  startsAt: string;
  endsAt: string;
  timeZone: string;
};

export type Activity = {
  id: string;
  planId: string;
  title: string;
  learnerIds: string[];
  lessonVersionId?: string;
  catalogLessonRef?: string;
  schedule?: Schedule;
  scheduleHistory?: readonly unknown[];
};

export type Experience = {
  id: string;
  title: string;
  happenedAt: string;
  activityId?: string;
};

export type LessonVersion = {
  id: string;
  lessonKey: string;
  familyId: string;
  versionLabel: string;
  title: string;
  subject: string;
  strand: string;
  learningLevel: string;
  learningGoal: string;
  successCriteria: string[];
  description?: string;
  materials: string[];
  steps: string[];
  adaptation?: string;
  estimatedMinutes?: number;
  creationMethod: 'manual' | 'ai-generated';
  aiProvider?: string;
  aiModel?: string;
  parentApprovedAt?: string;
  createdAt: string;
};

export type LearningRecord = {
  id: string;
  experienceId: string;
  learnerId: string;
  completed: boolean;
  observation?: string;
  lessonVersionId?: string;
  catalogLessonRef?: string;
  curriculumVersionId?: string;
};

export type CatalogueLesson = {
  id: string;
  reference: string;
  packId: string;
  packVersion: string;
  levelKey: string;
  levelLabel: string;
  learningAreaKey: string;
  learningArea: string;
  strand: string;
  title: string;
  summary: string;
  learningGoal: string;
  successCriteria: string[];
  materials: string[];
  estimatedMinutes: number;
  steps: string[];
  support: string;
  extension: string;
  parentPrompt: string;
  bibleConnection: {
    reference: string;
    paraphrase: string;
    reflectionPrompt: string;
  };
  safetyAndAccess: string;
  provenance: string;
  editorialStatus: 'needs-parent-review';
  jurisdictionMapping: null;
};

export type CatalogueCoverageCell = {
  levelKey: string;
  levelLabel: string;
  learningAreaKey: string;
  learningArea: string;
  targetLessonCount: number;
  draftLessonCount: number;
  reviewedLessonCount: number;
  status: 'needs-parent-review' | 'not-in-starter-pack';
};

export type CatalogueResponse = {
  pack: {
    id: string;
    version: string;
    title: string;
    totalLessons: number;
  };
  total: number;
  items: CatalogueLesson[];
};

export type Assessment = {
  id: string;
  learnerRecordId: string;
  outcomeId: string;
  assessedAt: string;
  judgement: Judgement;
  rationale?: string;
};

export async function request<T>(path: string, body?: unknown, method = 'POST'): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...(body === undefined ? {} : { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const id = () => `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
export const localTime = (hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
export async function loadAssessments(records: readonly LearningRecord[]): Promise<Assessment[]> {
  const results: Assessment[] = [];
  const batchSize = 8;
  for (let offset = 0; offset < records.length; offset += batchSize) {
    const batch = records.slice(offset, offset + batchSize);
    const assessments = await Promise.all(batch.map(record => request<Assessment[]>(`/api/v1/learner-records/${encodeURIComponent(record.id)}/assessments`, undefined, 'GET')));
    results.push(...assessments.flat());
  }
  return results;
}
