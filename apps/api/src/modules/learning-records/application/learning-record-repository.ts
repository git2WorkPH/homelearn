import type {
  LearnerLearningRecord,
  LearningExperience,
  OutcomeAssessment,
} from "../domain/learning-record.js";
export interface LearningRecordRepository {
  createExperience(item: LearningExperience): Promise<LearningExperience>;
  getExperience(id: string, familyId: string): Promise<LearningExperience | undefined>;
  listExperiences(familyId: string): Promise<readonly LearningExperience[]>;
  createLearnerRecord(
    item: LearnerLearningRecord,
  ): Promise<LearnerLearningRecord>;
  getLearnerRecord(id: string, familyId: string): Promise<LearnerLearningRecord | undefined>;
  listLearnerRecords(
    familyId: string,
    experienceId?: string,
  ): Promise<readonly LearnerLearningRecord[]>;
  updateLearnerRecord(
    record: LearnerLearningRecord,
    familyId: string,
  ): Promise<LearnerLearningRecord>;
  createAssessment(item: OutcomeAssessment): Promise<OutcomeAssessment>;
  listAssessments(
    learnerRecordId: string,
    familyId: string,
  ): Promise<readonly OutcomeAssessment[]>;
}
