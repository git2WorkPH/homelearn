import type { LessonVersion } from "../domain/lesson-version.js";

export interface LessonRepository {
  create(version: LessonVersion): Promise<LessonVersion>;
  get(id: string, familyId: string): Promise<LessonVersion | undefined>;
  list(familyId: string): Promise<readonly LessonVersion[]>;
}
