-- Add parent authentication and explicit family membership without deleting existing records.
CREATE TABLE "user" (
    "id" VARCHAR(200) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "image" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

CREATE TABLE "session" (
    "id" VARCHAR(200) NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "ipAddress" VARCHAR(255),
    "userAgent" TEXT,
    "userId" VARCHAR(200) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE INDEX "session_userId_idx" ON "session"("userId");

CREATE TABLE "account" (
    "id" VARCHAR(200) NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "providerId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(200) NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ(3),
    "refreshTokenExpiresAt" TIMESTAMPTZ(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "account_userId_idx" ON "account"("userId");

CREATE TABLE "verification" (
    "id" VARCHAR(200) NOT NULL,
    "identifier" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

CREATE TABLE "Family" (
    "id" VARCHAR(200) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "FamilyMember" (
    "userId" VARCHAR(200) NOT NULL,
    "familyId" VARCHAR(200) NOT NULL,
    "role" VARCHAR(40) NOT NULL DEFAULT 'parent',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("userId", "familyId")
);
CREATE INDEX "FamilyMember_familyId_userId_idx" ON "FamilyMember"("familyId", "userId");

-- Preserve old records by creating one family row for every family ID already in use.
INSERT INTO "Family" ("id", "name", "createdAt")
SELECT family_id, 'Existing HomeLearn family', CURRENT_TIMESTAMP
FROM (
    SELECT "familyId" AS family_id FROM "LessonVersion"
    UNION SELECT "familyId" FROM "LearningPlan"
    UNION SELECT "familyId" FROM "Activity"
    UNION SELECT "familyId" FROM "LearningExperience"
) AS existing_families
ON CONFLICT ("id") DO NOTHING;
INSERT INTO "Family" ("id", "name", "createdAt")
VALUES ('local-demo', 'HomeLearn Family', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
-- Keep old custom curricula private until an owner links them to a family.
INSERT INTO "Family" ("id", "name", "createdAt")
VALUES ('legacy-unassigned', 'Imported custom curricula pending owner review', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

ALTER TABLE "CurriculumVersion" ADD COLUMN "familyId" VARCHAR(200);
UPDATE "CurriculumVersion" SET "familyId" = 'legacy-unassigned' WHERE "sourceKind" = 'family';
CREATE INDEX "CurriculumVersion_familyId_curriculumId_idx" ON "CurriculumVersion"("familyId", "curriculumId");
CREATE UNIQUE INDEX "LessonVersion_familyId_id_key" ON "LessonVersion"("familyId", "id");
CREATE UNIQUE INDEX "LearningPlan_familyId_id_key" ON "LearningPlan"("familyId", "id");
CREATE UNIQUE INDEX "Activity_familyId_id_key" ON "Activity"("familyId", "id");

-- Replace ID-only links with family-consistent links.
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_planId_fkey";
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_familyId_planId_fkey"
    FOREIGN KEY ("familyId", "planId") REFERENCES "LearningPlan"("familyId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_lessonVersionId_fkey";
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_familyId_lessonVersionId_fkey"
    FOREIGN KEY ("familyId", "lessonVersionId") REFERENCES "LessonVersion"("familyId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningExperience" ADD CONSTRAINT "LearningExperience_familyId_activityId_fkey"
    FOREIGN KEY ("familyId", "activityId") REFERENCES "Activity"("familyId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LessonVersion" ADD CONSTRAINT "LessonVersion_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LearningExperience" ADD CONSTRAINT "LearningExperience_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurriculumVersion" ADD CONSTRAINT "CurriculumVersion_familyId_fkey"
    FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
