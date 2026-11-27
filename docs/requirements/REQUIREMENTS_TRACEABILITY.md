# Requirements traceability

Status: Updated 23 November 2026. Current verified and partial outcomes are recorded below; pending and deferred criteria remain explicit.

| Requirement | Acceptance | Owning modules | Planned verification |
|---|---|---|---|
| FR-001 | AC-001, AC-013 | Identity, family, learner | Application/API, real database, E2E |
| FR-002 | AC-002–004 | Configuration, onboarding presentation | Domain and E2E |
| FR-003 | AC-005 | Curriculum | Domain/database/API |
| FR-004 | AC-006 | Planning | Domain/application/database |
| FR-005 | AC-007–008 | Learning records | Domain/application/E2E |
| FR-006 | AC-009–010, AC-013 | Evidence | Real storage integration/security |
| FR-007 | AC-011, AC-013 | Reporting | Authorisation, PDF content/layout checks |
| FR-008 | AC-012 | Shared lesson catalogue, family lesson authoring, planning/learning links | Coverage, stable reference preservation, parent-selected associations and editorial status |
| FR-009 | AC-016 | Optional local lesson drafting | Ollama adapter validation, prompt minimisation and parent approval |
| FR-010 | AC-019 | Mobile resource browser | Native UI, HTTPS navigation policy, link handling and iOS device review |
| NFR-001–002 | AC-013–014 | All | Isolation and log inspection |
| NFR-003 | Quality gates | All | Oxlint, typecheck, boundary checker, build |
| NFR-004 | AC-017 | Mobile | Automated and manual accessibility |
| NFR-005 | AC-015 | All core modules | AI-disabled E2E |
| NFR-006 | AC-003, AC-005–008 | Curriculum/configuration/records | Domain and integration |
| NFR-007 | AC-009, AC-014 | API/storage/reporting | Limits and failure paths |
| NFR-008 | AC-018 | Persistence/storage | Migration and restore exercise |
| NFR-009 | AC-001, AC-009, AC-013 | Identity/infrastructure | Session, transport and storage review |

Add implementation paths and evidence links as milestones are delivered; never promote a proposed design to verified behaviour.

## HL-003A evidence update — 20 November 2026

FR-002 is PARTIAL: configuration domain only. AC-004 domain precedence/clearing/reference/conflict cases pass in apps/api/test/learning-configuration.test.ts. NFR-006 snapshot detachment is tested; persisted historical records remain NOT_STARTED. All onboarding, authenticated API and UI criteria remain unverified. Foundation NFR-003 checks pass for current sources. See [HL-003A](../changes/HL-003A-configuration-domain.md) for scope and commands.

Historical 20 November 2026 status before HL-004B persistence work: curriculum domain and local API behavior were covered by 27 API tests; planning domain tests passed while durable persistence was still NOT_STARTED. This snapshot was superseded by the HL-004B/004C updates below.


## Planning and learning update — 20 November 2026

FR-004 PARTIAL: plan/activity API and scheduling history are persisted through Prisma/PostgreSQL. FR-005 PARTIAL: spontaneous experiences, separate learner records and explicit assessments are persisted. These routes run on the loopback-only development API and use synthetic local family/learner IDs; authentication and family ownership are deferred, so production/network exposure is prohibited.

The default Expo view is an interactive, fictional sample-data prototype for Home, Planner, Journal and Progress; its sample edits remain in screen state only. The existing “Local API” view reads plans, activities, experiences, learning records and assessments from the local API and supports plan/activity authoring, observation updates and explicit assessments. Mobile/API behavior has synthetic-fixture coverage; the Prisma-backed API flow has an opt-in PostgreSQL integration test. Offline operation and real-device acceptance remain NOT_STARTED. Evidence/portfolio and authentication/family ownership remain DEFERRED by user direction. See [HL-004C](../changes/HL-004C-planning-learning-workflows.md) and [the interactive prototype record](../changes/planning-learning-visual-prototype.md).

Initial FR-008 catalogue release (superseded 27 November 2026): the source-controlled shared catalogue served pack `homelearn-k3-starter@2026.2` with 56 Bible-inspired K–3 drafts and read-only search/coverage endpoints. Mobile supported browse-to-plan, and references flowed to resulting learning records. Drafts remained unreviewed. Editorial tools, broader original K–12 content and NSW mapping were pending. Current catalogue state is recorded below and in the linked change records.

Family-experience lesson linking: the sample prototype supports lesson-first planning and experience-first linking. The local API now supports family-authored immutable lesson versions, optional local AI drafts requiring parent approval, and persisted references from activities and learner records. Full family authorization, version editing UI, multi-lesson links and reviewed K–12 content coverage remain outstanding.

FR-008 catalogue implementation update — 23 November 2026: API/mobile typechecks, Oxlint, API build, iOS Expo export, Prisma client generation and whitespace validation pass. After the user applied migration `0003_catalogue_lesson_references`, `pnpm --filter @homelearn/api test:postgres` passed (1 test), persisting and cleaning up synthetic activity/record references. Other test suites were not run in this verification pass. Existing authentication/family isolation remains deferred; no production use is supported.

Historical 22 November note: migration `0002_family_lessons` was reported unapplied at that time. It was subsequently applied by the user and the PostgreSQL persistence integration test was reported passing in the prior milestone. This does not verify new migration `0003`.

FR-008 native discovery update — 27 November 2026: implemented an in-app native full-screen browser for the existing shared K–3 pack, linked from the main Lessons tab. It provides level/learning-area filters, topic search, lesson guides and a plan action using the existing catalogue and planning API. Mobile typecheck, targeted Oxlint, iOS Expo export and whitespace validation pass. No new test was added or run, and runtime API/device behavior is not verified. Authentication and family isolation remain deferred.

FR-008 curated-topic update — 27 November 2026: added 36 original lessons for English, Mathematics and Science (three per Kindergarten–Year 3 level), selected using broad K–3 SkillrHub topic categories as reference only. Current version `2026.3` has 68 lessons; `2026.2` remains available through reference lookup. No official curriculum mapping is claimed. Root lint/typecheck, API build, iOS Expo export and whitespace validation pass. Tests not added or run; runtime old-reference lookup and device presentation remain unverified.

FR-010 implementation update — 27 November 2026: added an HEA free-resources entry to Lessons and a full-screen Expo WebView for the directory and linked HTTPS pages. Back follows WebView history and returns to Lessons at the root. HTTPS-only navigation and mixed-content blocking are configured; load errors offer retry and Safari. The Expo-compatible WebView dependency is installed and local CocoaPods autolinking completed. Mobile typecheck, targeted Oxlint, iOS Expo export, CocoaPods installation and whitespace validation pass; no tests were added or run. Embedded rendering and navigation on physical iOS devices remain unverified.
