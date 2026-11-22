# Family experience and K–12 lesson linking

Authorization: user requested implementing a connected lesson and family-experience workflow before proceeding with the larger lesson-catalogue milestone, then explicitly selected persistence of lesson ↔ family experience links.

Scope: add family-authored, structured and versioned lesson content to the local API workflow; allow parents to create a lesson manually or request an optional local Ollama draft; require explicit parent review before an AI draft is saved; and link saved lesson versions to planned activities and learning records. Keep lesson selection parent-controlled and preserve existing no-link workflows. The default visual prototype remains sample-state-only. No Chalkie connection, remote AI, authentication/family authorization, full reviewed K–12 content corpus, lesson-series builder, NSW mapping, or automatic assessment is included.

Rationale: provide HomeLearn's own parent-controlled lesson creation and drafting workflow, then connect the exact saved lesson version to authentic family activities and observations. Keep curriculum content, planned activities and observed learning separate. The parent chooses every association; AI only returns a structured draft and cannot save or alter records.

Data/privacy impact: add family lesson-version rows and optional foreign-key references from activities and learner records. Lesson-draft requests contain subject, strand, level, topic and optional teaching notes only; learner profiles and narratives are excluded. The Ollama adapter accepts loopback URLs only and request logging is disabled. Existing local API authentication/family authorization limitations are unchanged; the local API remains a development workflow.

Test coverage: KEEP focused interaction coverage for the default prototype's lesson-first planning and experience-first journal linking; ADD manual lesson API validation, AI output validation, explicit approval and mobile Local API workflow coverage; KEEP existing planning, journal, assessment and API workflow assertions.

Verification: run API and mobile tests, Oxlint, TypeScript checks, Prisma client generation, iOS Expo export and `git diff --check`; update results below. The additive PostgreSQL migration is prepared but not applied.

## Verification

Prior prototype-only verification (before persistence was approved): targeted Oxlint, mobile TypeScript, mobile Jest (3 tests), iOS Expo export and `git diff --check` passed.

Current milestone verification: PASS — API typecheck and direct TypeScript build; mobile typecheck and Jest (4 tests); API Vitest (38 passed, 1 PostgreSQL integration test skipped with `DATABASE_URL` unset); repository Oxlint; dependency-boundary check (50 modules / 85 dependencies); Prisma client generation and schema validation; iOS Expo export; `git diff --check`.

Limitations: lesson editing-as-a-new-version and multi-lesson associations are not implemented in this milestone. The default visual prototype remains in-memory; persistence is exercised through the existing Local API workflow. Authentication/family authorization, a reviewed K–12 lesson corpus, migration deployment and native simulator/VoiceOver validation remain outstanding.

The root pnpm workspace build command emitted no output and was interrupted; the affected API was built directly with TypeScript and the iOS app exported successfully. Ollama runtime generation and PostgreSQL persistence were not exercised. Migration `0002_family_lessons` is not applied.
