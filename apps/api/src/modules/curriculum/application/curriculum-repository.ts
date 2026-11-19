import type { CurriculumVersion } from '../domain/curriculum.js';
export interface CurriculumRepository {
  create(version: CurriculumVersion): Promise<CurriculumVersion>;
  get(versionId: string): Promise<CurriculumVersion | undefined>;
  list(): Promise<readonly CurriculumVersion[]>;
}
