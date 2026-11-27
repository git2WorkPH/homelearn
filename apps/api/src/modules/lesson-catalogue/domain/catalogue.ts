export const CATALOGUE_PACK_ID = "homelearn-k3-starter";
export const CATALOGUE_PACK_VERSION = "2026.3";
export const CATALOGUE_ARCHIVE_VERSION = "2026.2";
export type CataloguePackVersion =
  | typeof CATALOGUE_PACK_VERSION
  | typeof CATALOGUE_ARCHIVE_VERSION;
export const CATALOGUE_PACK_TITLE =
  "Kindergarten–Year 3 Bible-inspired starter lessons";

export const LEARNING_LEVELS = [
  { key: "kindergarten", label: "Kindergarten" },
  { key: "year-1", label: "Year 1" },
  { key: "year-2", label: "Year 2" },
  { key: "year-3", label: "Year 3" },
  { key: "year-4", label: "Year 4" },
  { key: "year-5", label: "Year 5" },
  { key: "year-6", label: "Year 6" },
  { key: "year-7", label: "Year 7" },
  { key: "year-8", label: "Year 8" },
  { key: "year-9", label: "Year 9" },
  { key: "year-10", label: "Year 10" },
  { key: "year-11", label: "Year 11" },
  { key: "year-12", label: "Year 12" },
] as const;

export const LEARNING_AREAS = [
  { key: "english", label: "English" },
  { key: "mathematics", label: "Mathematics" },
  { key: "science", label: "Science" },
  {
    key: "humanities-social-sciences",
    label: "Humanities and social sciences",
  },
  { key: "technologies", label: "Technologies" },
  { key: "the-arts", label: "The arts" },
  { key: "health-physical-education", label: "Health and physical education" },
  { key: "languages", label: "Languages" },
] as const;

export type LearningLevelKey = (typeof LEARNING_LEVELS)[number]["key"];
export type LearningAreaKey = (typeof LEARNING_AREAS)[number]["key"];

export interface CatalogueLesson {
  readonly id: string;
  readonly reference: string;
  readonly packId: typeof CATALOGUE_PACK_ID;
  readonly packVersion: CataloguePackVersion;
  readonly levelKey: LearningLevelKey;
  readonly levelLabel: string;
  readonly learningAreaKey: LearningAreaKey;
  readonly learningArea: string;
  readonly strand: string;
  readonly title: string;
  readonly summary: string;
  readonly learningGoal: string;
  readonly successCriteria: readonly string[];
  readonly materials: readonly string[];
  readonly estimatedMinutes: number;
  readonly steps: readonly string[];
  readonly support: string;
  readonly extension: string;
  readonly parentPrompt: string;
  readonly bibleConnection: {
    readonly reference: string;
    /** Original child-friendly paraphrase; do not copy wording from a Bible translation. */
    readonly paraphrase: string;
    readonly reflectionPrompt: string;
  };
  readonly safetyAndAccess: string;
  readonly provenance: "Original HomeLearn starter content";
  readonly editorialStatus: "needs-parent-review";
  readonly jurisdictionMapping: null;
}

export interface CatalogueCoverageCell {
  readonly levelKey: LearningLevelKey;
  readonly levelLabel: string;
  readonly learningAreaKey: LearningAreaKey;
  readonly learningArea: string;
  readonly targetLessonCount: number;
  readonly draftLessonCount: number;
  readonly reviewedLessonCount: number;
  readonly status: "needs-parent-review" | "not-in-starter-pack";
}

export interface CatalogueFilters {
  readonly levelKey?: LearningLevelKey;
  readonly learningAreaKey?: LearningAreaKey;
  readonly search?: string;
}

export function catalogueLessonRef(
  lesson: Pick<CatalogueLesson, "packId" | "packVersion" | "id">,
): string {
  return `${lesson.packId}@${lesson.packVersion}:${lesson.id}`;
}

export function isLearningLevelKey(value: string): value is LearningLevelKey {
  return LEARNING_LEVELS.some((level) => level.key === value);
}

export function isLearningAreaKey(value: string): value is LearningAreaKey {
  return LEARNING_AREAS.some((area) => area.key === value);
}
