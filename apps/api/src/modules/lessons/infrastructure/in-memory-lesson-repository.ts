import type { LessonRepository } from '../application/lesson-repository.js';
import type { LessonVersion } from '../domain/lesson-version.js';

export class InMemoryLessonRepository implements LessonRepository {
  readonly #versions = new Map<string, LessonVersion>();

  async create(version: LessonVersion): Promise<LessonVersion> {
    if (this.#versions.has(version.id) || [...this.#versions.values()].some(item => item.familyId === version.familyId && item.lessonKey === version.lessonKey && item.versionLabel === version.versionLabel)) {
      throw new Error('DUPLICATE_LESSON_VERSION');
    }
    this.#versions.set(version.id, version);
    return version;
  }

  async get(id: string, familyId: string): Promise<LessonVersion | undefined> {
    const lesson = this.#versions.get(id);
    return lesson?.familyId === familyId ? lesson : undefined;
  }

  async list(familyId: string): Promise<readonly LessonVersion[]> {
    return [...this.#versions.values()].filter(item => item.familyId === familyId).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}
