-- Add family-authored, immutable lesson versions and optional lesson links.
-- Existing activities and learning records remain unlinked (NULL).
CREATE TABLE "LessonVersion" (
    "id" VARCHAR(300) NOT NULL,
    "lessonKey" VARCHAR(200) NOT NULL,
    "familyId" VARCHAR(200) NOT NULL,
    "versionLabel" VARCHAR(40) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "subject" VARCHAR(120) NOT NULL,
    "strand" VARCHAR(160) NOT NULL,
    "learningLevel" VARCHAR(80) NOT NULL,
    "learningGoal" VARCHAR(1000) NOT NULL,
    "successCriteria" JSONB NOT NULL,
    "description" TEXT,
    "materials" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "adaptation" TEXT,
    "estimatedMinutes" INTEGER,
    "creationMethod" VARCHAR(20) NOT NULL,
    "aiProvider" VARCHAR(80),
    "aiModel" VARCHAR(120),
    "parentApprovedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LessonVersion_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Activity" ADD COLUMN "lessonVersionId" VARCHAR(300);
ALTER TABLE "LearnerLearningRecord" ADD COLUMN "lessonVersionId" VARCHAR(300);

CREATE UNIQUE INDEX "LessonVersion_familyId_lessonKey_versionLabel_key"
    ON "LessonVersion"("familyId", "lessonKey", "versionLabel");
CREATE INDEX "LessonVersion_familyId_createdAt_idx"
    ON "LessonVersion"("familyId", "createdAt");
CREATE INDEX "Activity_lessonVersionId_idx" ON "Activity"("lessonVersionId");
CREATE INDEX "LearnerLearningRecord_lessonVersionId_idx" ON "LearnerLearningRecord"("lessonVersionId");

ALTER TABLE "Activity" ADD CONSTRAINT "Activity_lessonVersionId_fkey"
    FOREIGN KEY ("lessonVersionId") REFERENCES "LessonVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearnerLearningRecord" ADD CONSTRAINT "LearnerLearningRecord_lessonVersionId_fkey"
    FOREIGN KEY ("lessonVersionId") REFERENCES "LessonVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
