# Requirements traceability

Status: Draft. Implementation is absent; every row is NOT_STARTED and verification NOT RUN.

| Requirement | Acceptance | Owning modules | Planned verification |
|---|---|---|---|
| FR-001 | AC-001, AC-013 | Identity, family, learner | Application/API, real database, E2E |
| FR-002 | AC-002–004 | Configuration, onboarding presentation | Domain and E2E |
| FR-003 | AC-005 | Curriculum | Domain/database/API |
| FR-004 | AC-006 | Planning | Domain/application/database |
| FR-005 | AC-007–008 | Learning records | Domain/application/E2E |
| FR-006 | AC-009–010, AC-013 | Evidence | Real storage integration/security |
| FR-007 | AC-011, AC-013 | Reporting | Authorisation, PDF content/layout checks |
| FR-008 | AC-012 | Curriculum/planning templates | Provenance and educational review |
| FR-009 | AC-016 | Optional AI | Adapter validation and approval tests |
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

20 November 2026 update: curriculum domain and local API behavior are covered by 27 passing API tests in aggregate. Prisma schema validation/client generation pass, but persistence acceptance is NOT RUN and remains incomplete. Planning domain behavior tests pass; plan persistence/API remains NOT_STARTED. Full workspace lint, typecheck, tests, dependency boundaries and build passed at the final local verification.
