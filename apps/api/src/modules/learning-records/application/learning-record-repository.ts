import type { LearnerLearningRecord, LearningExperience, OutcomeAssessment } from '../domain/learning-record.js';
export interface LearningRecordRepository {
  createExperience(item: LearningExperience): Promise<LearningExperience>;
  getExperience(id: string): Promise<LearningExperience | undefined>;
  listExperiences(): Promise<readonly LearningExperience[]>;
  createLearnerRecord(item: LearnerLearningRecord): Promise<LearnerLearningRecord>;
  getLearnerRecord(id: string): Promise<LearnerLearningRecord | undefined>;
  listLearnerRecords(experienceId?: string): Promise<readonly LearnerLearningRecord[]>;
  updateLearnerRecord(record: LearnerLearningRecord): Promise<LearnerLearningRecord>;
  createAssessment(item: OutcomeAssessment): Promise<OutcomeAssessment>;
  listAssessments(learnerRecordId: string): Promise<readonly OutcomeAssessment[]>;
}
