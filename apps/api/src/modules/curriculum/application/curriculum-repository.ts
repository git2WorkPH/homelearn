import type { CurriculumVersion } from '../domain/curriculum.js';
export interface CurriculumRepository {
  create(version: CurriculumVersion): Promise<CurriculumVersion>;
  get(versionId: string, familyId: string): Promise<CurriculumVersion | undefined>;
  list(familyId: string): Promise<readonly CurriculumVersion[]>;
}
