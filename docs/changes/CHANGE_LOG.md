# Change log and justification

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
