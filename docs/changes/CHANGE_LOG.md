# Change log and justification

## 27 November 2026 — Native K–3 catalogue in Lessons

Authorisation: user approved bringing a HomeLearn-native catalogue experience into the app, using SkillrHub's year/subject/topic navigation as a design reference only. See [change rationale](in-app-k3-catalogue.md).

Changes: connect the main Lessons tab to a native full-screen browser for the existing 56-lesson Bible-inspired K–3 pack. Parents can filter by level and learning area, search topics, open lesson guides and add the selected version to a weekly plan. Keep the existing local API catalogue/workspace route available. No SkillrHub content, branding, API or embed is used.

Rationale: the main Lessons tab previously showed illustrative ideas and sent parents to a separate local API workflow to reach the shared starter lessons. The integrated catalogue makes HomeLearn's own pack discoverable in the primary app experience.

Validation: mobile typecheck, targeted Oxlint, iOS Expo export and `git diff --check` pass. Automated tests were not added or run in this change. No packages, schema, migrations, catalogue data, credentials, branches or database records were changed. The export does not verify simulator/device presentation or API runtime connectivity.

## 23 November 2026 — K–3 starter lesson catalogue implementation

Authorisation: user approved the first catalogue implementation slice and requested to review the implementation before deciding next steps. See [change justification](k-3-starter-lesson-catalogue.md).

Changes: add a source-controlled versioned pack with 56 original K–3 draft lessons across seven learning areas, K–12 catalogue and coverage API, mobile browse/search/filter/detail flow, and optional versioned references from activities and learning records. Every lesson is identified as needing parent review; uncovered levels and areas remain visible. Add Prisma migration `0003_catalogue_lesson_references`; it was not applied during the initial implementation.

Validation: API/mobile typecheck, Oxlint, API build, iOS Expo export, Prisma client generation and `git diff --check` pass. The user applied migration `0003_catalogue_lesson_references`; the PostgreSQL persistence integration test later passed with synthetic records and cleanup. Other suites were not run in this execution. The implementation was committed locally; no push was performed.

Limitations: the 56 lessons are drafts awaiting parent review, coverage is not editorially verified, K–4–12 lesson authoring/content remains outstanding, Languages content awaits a language choice, and no NSW syllabus mapping or compliance claim is included. Authentication and family authorization remain deferred.

### Follow-up — Bible-inspired lesson direction

User direction: make the K–3 starter lessons Bible-inspired and use passage references with child-friendly paraphrases, without quoting a translation. Update pack to `2026.2`; add a visible Bible connection and reflection prompt to each lesson. This framing supplements each subject lesson; all content still needs parent review. See the follow-up in [the catalogue change rationale](k-3-starter-lesson-catalogue.md).

## 22 November 2026 — Create lessons and link them with family experiences

Authorization: user asked to implement the lesson/family experience prototype, clarified that HomeLearn should provide its own Chalkie-like lesson creation (no Chalkie connection), selected manual authoring first, then requested AI generation as well.

Changes: add immutable family lesson versions, a structured lesson authoring flow, optional local Ollama draft generation, explicit parent review before AI drafts can be saved, and lesson-version references on activities and learner records. Add an additive Prisma migration and API/mobile coverage. Update lesson, AI, data and requirements documentation. See [change rationale and scope](family-experience-lesson-linking.md).

Rationale: create original HomeLearn lesson content for a parent-led K–12 workflow, then let parents connect a chosen version to a planned activity or observed family experience. Keep plans, experiences and assessments distinct.

Limitations: migration is prepared but not applied; the local API remains unauthenticated and loopback-only. Lesson version editing UI, multi-lesson associations, full K–12 reviewed content corpus, lesson-series/worksheet generation, and NSW mapping remain deferred. AI is local-only and cannot save drafts without parent approval.

Validation: API typecheck/build, mobile typecheck, Oxlint, API Vitest (38 passed; PostgreSQL integration skipped), mobile Jest (4 passed), dependency-boundary check, Prisma generate/validate, iOS Expo export and `git diff --check` pass. The root pnpm build command stalled and was interrupted; direct API TypeScript build succeeded. Database-backed behavior is not verified until the migration is applied.

## 20 November 2026 — Lesson catalogue structure and deferred backlog

Authorisation: user requested implementing the subject/level definition, lesson template and review/coverage design, deferring NSW references, and recording deferred work for later.

Changes: specify the shared subject/strand taxonomy and Kindergarten–Year 12 labels; define lesson fields, editorial lifecycle and level/strand coverage semantics; extend the Lessons prototype with a detailed lesson preview and illustrative review-coverage view; add backlog tasks HL-011–HL-013 for catalogue implementation, reviewed K–12 content authoring and later NSW source mapping. Existing authentication, evidence/portfolio, reports and accessibility tasks remain in the backlog. See [catalogue foundation rationale](lesson-catalogue-foundation.md) and [catalogue plan](../requirements/LESSON_CATALOGUE_PLAN.md).

Rationale: agree on what the finished product needs to represent before implementing persistence or authoring tools. NSW references and the full lesson corpus remain deferred as requested.

Validation: targeted Oxlint, mobile TypeScript, mobile Jest (2 tests), iOS Expo export and `git diff --check` pass. The sample coverage statuses remain explicitly illustrative and are not editorial evidence.

## 20 November 2026 — K–12 lesson catalogue design and prototype

Authorisation: user requested modifying the finish-product design to cover K–12 lessons across subject areas. Scope: interactive design prototype and requirements/data-model documentation; no backend content service, production lesson content or migrations.

Changes: add a Lessons tab with K–12 level selection, subject filters, search, original illustrative previews, family-defined subject creation and an action to add a lesson to the weekly plan. Expand FR-008 and AC-012 to set K–12 catalogue coverage as an MVP acceptance target delivered through reviewed packs, and document versioned lesson content, explicit coverage status and separately sourced jurisdiction mappings.

Rationale: make the missing curriculum discovery experience visible while setting an honest bar for the finished product. The prototype's small sample is not a completed K–12 library, and it makes no official NSW syllabus alignment claim.

Validation: Oxlint, mobile TypeScript check, mobile Jest suite (2 tests), `git diff --check` and iOS Expo export pass. Expo export must run from `apps/mobile` so it resolves the package's `index.ts` entry. No packages, schema, migrations or Git branch changed.

## 20 November 2026 — Interactive planning and learning prototype

Authorization: user asked for a prototype to evaluate the intended finished product. See [prototype rationale and scope](planning-learning-visual-prototype.md).

Changes: make the Home/Planner/Journal/Progress sample-data prototype the default iOS view, preserve access to the existing local API screen, and add prototype navigation and workflow interaction coverage. No dependencies, schema, migrations or backend behavior changed.

Validation: Oxlint, mobile TypeScript check, mobile Jest tests and iOS Expo export pass. Native simulator and VoiceOver validation remain pending.

## 20 November 2026 — HL-004C planning and learning workflows

Authorisation: user approved continuing implementation with activity authoring/editing, observations and explicit assessments, plus API and PostgreSQL persistence tests. Authentication/family ownership and evidence/portfolios remain deferred.

Changes: add activity edit API for title, learner assignments, and scheduled/flexible changes with schedule revision history; add observation update and assessment listing APIs; expose plan/activity/record/assessment workflows in the iOS app; add synthetic API, mobile interaction and opt-in PostgreSQL tests. See [HL-004C](HL-004C-planning-learning-workflows.md) for rationale, verification and limitations.

Security and data impact: no migration; API remains loopback-only and uses synthetic IDs. PostgreSQL verification cleaned up only test-generated IDs. No real learner data, credentials or database URL are included in source or test output.

## 19 November 2026 — iOS frontend and Prisma specification update

Authorisation: user approved updating specifications to React Native/Expo for iPhone/iPad and requested Prisma instead of Drizzle unless a strong technical objection existed. No blocking objection identified. This is documentation-only authorisation.

Changes: align AGENTS.md baseline and architecture, data, roadmap/backlog, scope, acceptance and traceability terminology. Replace planned Next.js/Tailwind/shadcn web UI with native UI; defer web/Android and browser E2E, while preserving required native workflow coverage. Prisma replaces Drizzle in backend persistence. Original baseline entry below is retained as history.

Rationale: build directly for the intended devices and honour the preferred ORM without changing family isolation or Clean Architecture. No implemented UI, tests, schemas or dependencies are removed: none exist. Native test tools, authentication, distribution, offline behaviour and exact dependency versions remain open. Prisma constraints and migrations require review against the selected version.

Validation: inspect remaining old-stack references and local Markdown links; no application checks are available. No packages, migrations, branch changes, commits or external builds are authorised or performed.

## 19 November 2026 — Initial documentation baseline

Authorisation: the user replied “approved” to the explicit request to create the proposed documentation set only. This authorises these draft documents, not application implementation, dependency installation, branch changes, commits or pushes.

Change: add 19 Markdown files in product (3), requirements (5), architecture (6), decisions (1), planning (3) and changes (1).

Why: turn the master prompt and discovery proposal into reviewable, linked requirements, acceptance criteria, domain/data/API/security designs and bounded implementation tasks. FR-001–FR-009 and proposed NFR-001–NFR-009 are mapped to acceptance or quality gates.

Architecture/security impact: documentation only. Detailed design choices remain proposed. No schemas, runtime behaviour, dependencies or security controls were implemented. No removals or existing-file edits are part of this task.

Governance: apply installed continuity-documentation and related discovery/planning/change workflows; HomeLearn's docs/ layout is canonical. Do not duplicate global governance rules.

Validation: inspect document inventory, local links, status labels and repository diff. Application lint/typecheck/test/build are NOT RUN because no application tooling exists. Documentation approval does not establish acceptance of product behaviour.

Known limitations: authentication, configuration details, catalog ownership, upload scanning, operational policies and legal/regulatory applicability remain open in [risks and assumptions](../planning/RISKS_AND_ASSUMPTIONS.md).

Handover: review the documents, resolve foundation choices and obtain explicit scoped approval for HL-001. Observed Git before document creation: master tracking origin/master, untracked README.md. No branch switch or commit performed.
