import type { CatalogueRepository } from "../application/catalogue-repository.js";
import {
  ARCHIVED_K3_LESSONS,
  STARTER_K3_COVERAGE,
  STARTER_K3_LESSONS,
} from "../content/starter-k3-pack.js";
import type { CatalogueFilters, CatalogueLesson } from "../domain/catalogue.js";

const ALL_CATALOGUE_LESSONS = [
  ...STARTER_K3_LESSONS,
  ...ARCHIVED_K3_LESSONS,
];

export class InMemoryCatalogueRepository implements CatalogueRepository {
  async get(reference: string): Promise<CatalogueLesson | undefined> {
    return ALL_CATALOGUE_LESSONS.find((lesson) => lesson.reference === reference);
  }

  async list(
    filters: CatalogueFilters = {},
  ): Promise<readonly CatalogueLesson[]> {
    const query = filters.search?.trim().toLocaleLowerCase("en-AU");
    return STARTER_K3_LESSONS.filter(
      (lesson) =>
        (filters.levelKey === undefined ||
          lesson.levelKey === filters.levelKey) &&
        (filters.learningAreaKey === undefined ||
          lesson.learningAreaKey === filters.learningAreaKey) &&
        (query === undefined ||
          query === "" ||
          [
            lesson.title,
            lesson.learningArea,
            lesson.strand,
            lesson.summary,
            lesson.learningGoal,
          ].some((value) => value.toLocaleLowerCase("en-AU").includes(query))),
    );
  }

  async coverage() {
    return STARTER_K3_COVERAGE;
  }
}
