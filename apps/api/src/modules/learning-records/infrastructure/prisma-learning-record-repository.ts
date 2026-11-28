import { Prisma } from "../../../generated/prisma/client.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  LearnerLearningRecord,
  LearningExperience,
  OutcomeAssessment,
} from "../domain/learning-record.js";
import type { LearningRecordRepository } from "../application/learning-record-repository.js";

function mapExperience(row: {
  id: string;
  familyId: string;
  happenedAt: Date;
  activityId: string | null;
  title: string;
}): LearningExperience {
  return {
    id: row.id,
    familyId: row.familyId,
    happenedAt: row.happenedAt.toISOString(),
    title: row.title,
    ...(row.activityId === null ? {} : { activityId: row.activityId }),
  };
}

function mapRecord(row: {
  id: string;
  experienceId: string;
  learnerId: string;
  observation: string | null;
  completed: boolean;
  lessonVersionId: string | null;
  catalogLessonRef: string | null;
  curriculumVersionId: string | null;
  configurationSnapshot: unknown;
}): LearnerLearningRecord {
  return {
    id: row.id,
    experienceId: row.experienceId,
    learnerId: row.learnerId,
    completed: row.completed,
    ...(row.observation === null ? {} : { observation: row.observation }),
    ...(row.lessonVersionId === null
      ? {}
      : { lessonVersionId: row.lessonVersionId }),
    ...(row.catalogLessonRef === null
      ? {}
      : { catalogLessonRef: row.catalogLessonRef }),
    ...(row.curriculumVersionId === null
      ? {}
      : { curriculumVersionId: row.curriculumVersionId }),
    ...(row.configurationSnapshot === null
      ? {}
      : {
          configurationSnapshot: row.configurationSnapshot as Readonly<
            Record<string, unknown>
          >,
        }),
  };
}

export class PrismaLearningRecordRepository implements LearningRecordRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async createExperience(
    item: LearningExperience,
  ): Promise<LearningExperience> {
    return mapExperience(
      await this.prisma.learningExperience.create({
        data: {
          id: item.id,
          familyId: item.familyId,
          happenedAt: new Date(item.happenedAt),
          title: item.title,
          ...(item.activityId === undefined
            ? {}
            : { activityId: item.activityId }),
        },
      }),
    );
  }

  async getExperience(id: string, familyId: string): Promise<LearningExperience | undefined> {
    const row = await this.prisma.learningExperience.findFirst({
      where: { id, familyId },
    });
    return row === null ? undefined : mapExperience(row);
  }
  async listExperiences(familyId: string): Promise<readonly LearningExperience[]> {
    return (
      await this.prisma.learningExperience.findMany({
        where: { familyId }, orderBy: { happenedAt: "desc" },
      })
    ).map(mapExperience);
  }

  async createLearnerRecord(
    item: LearnerLearningRecord,
  ): Promise<LearnerLearningRecord> {
    const row = await this.prisma.learnerLearningRecord.create({
      data: {
        id: item.id,
        experienceId: item.experienceId,
        learnerId: item.learnerId,
        completed: item.completed,
        lessonVersionId: item.lessonVersionId ?? null,
        catalogLessonRef: item.catalogLessonRef ?? null,
        ...(item.observation === undefined
          ? {}
          : { observation: item.observation }),
        ...(item.curriculumVersionId === undefined
          ? {}
          : { curriculumVersionId: item.curriculumVersionId }),
        configurationSnapshot:
          item.configurationSnapshot === undefined
            ? Prisma.DbNull
            : (item.configurationSnapshot as Prisma.InputJsonValue),
      },
    });
    return mapRecord(row);
  }
  async getLearnerRecord(
    id: string, familyId: string,
  ): Promise<LearnerLearningRecord | undefined> {
    const row = await this.prisma.learnerLearningRecord.findUnique({
      where: { id, experience: { familyId } },
    });
    return row === null ? undefined : mapRecord(row);
  }

  async listLearnerRecords(
    familyId: string, experienceId?: string,
  ): Promise<readonly LearnerLearningRecord[]> {
    const rows = await this.prisma.learnerLearningRecord.findMany({
      where: { experience: { familyId, ...(experienceId === undefined ? {} : { id: experienceId }) } },
    });
    return rows.map(mapRecord);
  }

  async updateLearnerRecord(
    item: LearnerLearningRecord,
    familyId: string,
  ): Promise<LearnerLearningRecord> {
    const existing = await this.getLearnerRecord(item.id, familyId);
    if (existing === undefined) throw new Error('LEARNER_RECORD_NOT_FOUND');
    const result = await this.prisma.learnerLearningRecord.updateMany({
      where: { id: item.id, experience: { familyId } },
      data: { observation: item.observation ?? null },
    });
    if (result.count !== 1) throw new Error('LEARNER_RECORD_NOT_FOUND');
    return item;
  }

  async createAssessment(item: OutcomeAssessment): Promise<OutcomeAssessment> {
    const row = await this.prisma.outcomeAssessment.create({
      data: { ...item, assessedAt: new Date(item.assessedAt) },
    });
    return {
      id: row.id,
      learnerRecordId: row.learnerRecordId,
      outcomeId: row.outcomeId,
      assessedAt: row.assessedAt.toISOString(),
      assessedBy: row.assessedBy,
      judgement: row.judgement as OutcomeAssessment["judgement"],
      ...(row.rationale === null ? {} : { rationale: row.rationale }),
    };
  }

  async listAssessments(
    learnerRecordId: string,
    familyId: string,
  ): Promise<readonly OutcomeAssessment[]> {
    const rows = await this.prisma.outcomeAssessment.findMany({
      where: { learnerRecordId, learnerRecord: { experience: { familyId } } },
      orderBy: { assessedAt: "asc" },
    });
    return rows.map((row) => ({
      id: row.id,
      learnerRecordId: row.learnerRecordId,
      outcomeId: row.outcomeId,
      assessedAt: row.assessedAt.toISOString(),
      assessedBy: row.assessedBy,
      judgement: row.judgement as OutcomeAssessment["judgement"],
      ...(row.rationale === null ? {} : { rationale: row.rationale }),
    }));
  }
}
