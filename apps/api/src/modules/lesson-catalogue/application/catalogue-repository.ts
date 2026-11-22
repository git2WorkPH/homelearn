import type { CatalogueCoverageCell, CatalogueFilters, CatalogueLesson } from '../domain/catalogue.js';

export interface CatalogueRepository {
  get(reference: string): Promise<CatalogueLesson | undefined>;
  list(filters?: CatalogueFilters): Promise<readonly CatalogueLesson[]>;
  coverage(): Promise<readonly CatalogueCoverageCell[]>;
}
