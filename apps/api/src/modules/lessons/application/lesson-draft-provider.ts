import type {
  LessonDraft,
  LessonDraftRequest,
} from "../domain/lesson-version.js";

/** Optional adapter. A draft provider must not receive child profiles or learning records. */
export interface LessonDraftProvider {
  readonly providerId: string;
  readonly modelId: string;
  generate(input: LessonDraftRequest): Promise<LessonDraft>;
}
