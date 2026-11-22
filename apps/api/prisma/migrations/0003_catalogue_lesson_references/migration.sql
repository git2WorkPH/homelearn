-- Preserve immutable source-controlled catalogue references on family learning records.
-- The catalogue pack is versioned with the application source, so these references are
-- validated by the catalogue module rather than a database foreign key.
ALTER TABLE "Activity" ADD COLUMN "catalogLessonRef" VARCHAR(300);
ALTER TABLE "LearnerLearningRecord" ADD COLUMN "catalogLessonRef" VARCHAR(300);

CREATE INDEX "Activity_catalogLessonRef_idx" ON "Activity"("catalogLessonRef");
CREATE INDEX "LearnerLearningRecord_catalogLessonRef_idx" ON "LearnerLearningRecord"("catalogLessonRef");
