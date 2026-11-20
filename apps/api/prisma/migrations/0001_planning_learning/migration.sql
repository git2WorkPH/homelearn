-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumVersion" (
    "id" VARCHAR(240) NOT NULL,
    "curriculumId" VARCHAR(200) NOT NULL,
    "versionLabel" VARCHAR(100) NOT NULL,
    "sourceKind" VARCHAR(20) NOT NULL,
    "publisher" VARCHAR(200) NOT NULL,
    "sourceUrl" TEXT,
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE,
    "retrievedAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningOutcome" (
    "id" VARCHAR(300) NOT NULL,
    "curriculumVersionId" VARCHAR(240) NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT,

    CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumLearnerGoal" (
    "id" VARCHAR(200) NOT NULL,
    "learnerId" VARCHAR(200) NOT NULL,
    "curriculumVersionId" VARCHAR(240) NOT NULL,
    "outcomeId" VARCHAR(300) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "CurriculumLearnerGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPlan" (
    "id" VARCHAR(200) NOT NULL,
    "familyId" VARCHAR(200) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "startsOn" DATE NOT NULL,
    "endsOn" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" VARCHAR(200) NOT NULL,
    "familyId" VARCHAR(200) NOT NULL,
    "planId" VARCHAR(200) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "schedule" JSONB,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityAssignment" (
    "activityId" VARCHAR(200) NOT NULL,
    "learnerId" VARCHAR(200) NOT NULL,

    CONSTRAINT "ActivityAssignment_pkey" PRIMARY KEY ("activityId","learnerId")
);

-- CreateTable
CREATE TABLE "ActivityScheduleRevision" (
    "id" VARCHAR(200) NOT NULL,
    "activityId" VARCHAR(200) NOT NULL,
    "previous" JSONB,
    "next" JSONB,
    "changedAt" TIMESTAMPTZ(3) NOT NULL,
    "changedBy" VARCHAR(200) NOT NULL,

    CONSTRAINT "ActivityScheduleRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningExperience" (
    "id" VARCHAR(200) NOT NULL,
    "familyId" VARCHAR(200) NOT NULL,
    "happenedAt" TIMESTAMPTZ(3) NOT NULL,
    "activityId" VARCHAR(200),
    "title" VARCHAR(500) NOT NULL,

    CONSTRAINT "LearningExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerLearningRecord" (
    "id" VARCHAR(200) NOT NULL,
    "experienceId" VARCHAR(200) NOT NULL,
    "learnerId" VARCHAR(200) NOT NULL,
    "observation" TEXT,
    "completed" BOOLEAN NOT NULL,
    "curriculumVersionId" VARCHAR(240),
    "configurationSnapshot" JSONB,

    CONSTRAINT "LearnerLearningRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeAssessment" (
    "id" VARCHAR(200) NOT NULL,
    "learnerRecordId" VARCHAR(200) NOT NULL,
    "outcomeId" VARCHAR(300) NOT NULL,
    "assessedAt" TIMESTAMPTZ(3) NOT NULL,
    "assessedBy" VARCHAR(200) NOT NULL,
    "judgement" VARCHAR(30) NOT NULL,
    "rationale" TEXT,

    CONSTRAINT "OutcomeAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CurriculumVersion_curriculumId_effectiveFrom_idx" ON "CurriculumVersion"("curriculumId", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumVersion_curriculumId_versionLabel_key" ON "CurriculumVersion"("curriculumId", "versionLabel");

-- CreateIndex
CREATE INDEX "LearningOutcome_curriculumVersionId_idx" ON "LearningOutcome"("curriculumVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningOutcome_curriculumVersionId_code_key" ON "LearningOutcome"("curriculumVersionId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "LearningOutcome_curriculumVersionId_id_key" ON "LearningOutcome"("curriculumVersionId", "id");

-- CreateIndex
CREATE INDEX "CurriculumLearnerGoal_learnerId_createdAt_idx" ON "CurriculumLearnerGoal"("learnerId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumLearnerGoal_learnerId_outcomeId_key" ON "CurriculumLearnerGoal"("learnerId", "outcomeId");

-- CreateIndex
CREATE INDEX "LearningPlan_familyId_startsOn_idx" ON "LearningPlan"("familyId", "startsOn");

-- CreateIndex
CREATE INDEX "Activity_familyId_planId_idx" ON "Activity"("familyId", "planId");

-- CreateIndex
CREATE INDEX "ActivityAssignment_learnerId_idx" ON "ActivityAssignment"("learnerId");

-- CreateIndex
CREATE INDEX "ActivityScheduleRevision_activityId_changedAt_idx" ON "ActivityScheduleRevision"("activityId", "changedAt");

-- CreateIndex
CREATE INDEX "LearningExperience_familyId_happenedAt_idx" ON "LearningExperience"("familyId", "happenedAt");

-- CreateIndex
CREATE INDEX "LearnerLearningRecord_learnerId_idx" ON "LearnerLearningRecord"("learnerId");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerLearningRecord_experienceId_learnerId_key" ON "LearnerLearningRecord"("experienceId", "learnerId");

-- CreateIndex
CREATE INDEX "OutcomeAssessment_learnerRecordId_assessedAt_idx" ON "OutcomeAssessment"("learnerRecordId", "assessedAt");

-- AddForeignKey
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningOutcome" ADD CONSTRAINT "LearningOutcome_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumLearnerGoal" ADD CONSTRAINT "CurriculumLearnerGoal_curriculumVersionId_fkey" FOREIGN KEY ("curriculumVersionId") REFERENCES "CurriculumVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumLearnerGoal" ADD CONSTRAINT "CurriculumLearnerGoal_curriculumVersionId_outcomeId_fkey" FOREIGN KEY ("curriculumVersionId", "outcomeId") REFERENCES "LearningOutcome"("curriculumVersionId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LearningPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityAssignment" ADD CONSTRAINT "ActivityAssignment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityScheduleRevision" ADD CONSTRAINT "ActivityScheduleRevision_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerLearningRecord" ADD CONSTRAINT "LearnerLearningRecord_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "LearningExperience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutcomeAssessment" ADD CONSTRAINT "OutcomeAssessment_learnerRecordId_fkey" FOREIGN KEY ("learnerRecordId") REFERENCES "LearnerLearningRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
