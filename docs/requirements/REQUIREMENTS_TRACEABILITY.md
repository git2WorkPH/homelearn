# Requirements traceability

Status: Updated 20 November 2026. Current verified and partial outcomes are recorded below; pending and deferred criteria remain explicit.

| Requirement | Acceptance | Owning modules | Planned verification |
|---|---|---|---|
| FR-001 | AC-001, AC-013 | Identity, family, learner | Application/API, real database, E2E |
| FR-002 | AC-002–004 | Configuration, onboarding presentation | Domain and E2E |
| FR-003 | AC-005 | Curriculum | Domain/database/API |
| FR-004 | AC-006 | Planning | Domain/application/database |
| FR-005 | AC-007–008 | Learning records | Domain/application/E2E |
| FR-006 | AC-009–010, AC-013 | Evidence | Real storage integration/security |
| FR-007 | AC-011, AC-013 | Reporting | Authorisation, PDF content/layout checks |
| FR-008 | AC-012 | Family lesson authoring, versioning and planning/learning links | Lesson validation, version preservation and parent-selected associations |
| FR-009 | AC-016 | Optional local lesson drafting | Ollama adapter validation, prompt minimisation and parent approval |
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

FR-008 design update: subject/strand taxonomy, Kindergarten–Year 12 labels, standard lesson fields, review lifecycle and explicit coverage semantics are specified in [LESSON_CATALOGUE_PLAN.md](LESSON_CATALOGUE_PLAN.md). The local API now persists family-authored lesson versions and lesson-version links; the default sample prototype remains illustrative. Shared catalogue persistence, editorial tools and the complete original content corpus remain deferred under HL-011–HL-013. NSW mappings remain deferred.

Family-experience lesson linking: the sample prototype supports lesson-first planning and experience-first linking. The local API now supports family-authored immutable lesson versions, optional local AI drafts requiring parent approval, and persisted references from activities and learner records. Full family authorization, version editing UI, multi-lesson links and reviewed K–12 content coverage remain outstanding.

FR-008/FR-009 partial verification: API and mobile synthetic tests cover manual family lesson creation, optional local AI draft output, explicit review before saving and lesson-version references on planned activities and learning records. Prisma generation/schema validation pass. PostgreSQL integration remains SKIPPED and the additive migration remains unapplied; production persistence and end-to-end family authorization are not verified.
