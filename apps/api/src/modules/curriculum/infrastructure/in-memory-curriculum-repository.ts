import type { CurriculumVersion } from '../domain/curriculum.js';
import type { CurriculumRepository } from '../application/curriculum-repository.js';
/** Development adapter only. Data is lost when the process restarts; never use for family records. */
export class InMemoryCurriculumRepository implements CurriculumRepository {
  readonly #versions = new Map<string, CurriculumVersion>();
  async create(version: CurriculumVersion): Promise<CurriculumVersion> {
    if (this.#versions.has(version.id)) throw new Error('DUPLICATE_VERSION');
    this.#versions.set(version.id, version);
    return version;
  }
  async get(versionId: string): Promise<CurriculumVersion | undefined> { return this.#versions.get(versionId); }
  async list(): Promise<readonly CurriculumVersion[]> { return [...this.#versions.values()]; }
}
