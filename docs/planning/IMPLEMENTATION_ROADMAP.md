# Implementation roadmap

Status: Roadmap baseline; milestone scope is updated as the user approves implementation work.

| Milestone | Outcome | Exit criteria | Complexity |
|---|---|---|---|
| 0 Specifications | This documentation set and resolved blocking decisions | Owner reviews scope, model and security design | Medium |
| 1 Foundation | Approved workspace/dependencies, app shells, local services and quality gates | Build, health endpoint, lint/typecheck/tests and boundary checks | Medium |
| 2 Family access | Authentication, family membership and learners | AC-001 and isolation tests | High |
| 3 Learning setup | Modes, onboarding, configuration, curriculum/goals | AC-002–005 | High |
| 4 Planning/records | Shared activities, schedule history, spontaneous records, assessments | AC-006–008 | High |
| 4A Family lesson authoring | Create immutable family lesson versions manually or as reviewed local AI drafts; link versions to activities and learner records | AC-012, AC-016; migration deployment | Medium–high |
| 4B Shared lesson catalogue slice | Browse a versioned original K–3 starter pack, see K–12 coverage gaps, and link selected lessons to plans and learning records | AC-012; migration 0003 deployment; parent content review | Medium |
| 5 Evidence/reports | Safe private uploads, portfolios, PDF exports | AC-009–011, AC-013 | High |
| 6 MVP acceptance | Original content, accessibility, recovery and complete journeys | Remaining P0 criteria and quality gates | High |
| 7 Optional AI | Expand local AI beyond lesson drafts to other validated suggestions; preserve parent review and AI-disabled core workflows | AC-016 plus AI-disabled regression | Medium–high |

Each milestone includes traceability, change justification, tests and review. Dependencies follow the sequence; content design may proceed alongside core workflows when separately authorised. Calendar estimates await authentication, storage and hosting decisions.

Current implementation: family lesson authoring and optional local AI drafting are available in the local API workflow. The shared catalogue currently serves 68 original K–3 lessons in version `2026.3`, with 56 lessons from `2026.2` retained for historical reference lookup. The API provides K–12 coverage and the mobile app provides native browse-to-plan linking. Migrations `0002_family_lessons` and `0003_catalogue_lesson_references` are applied; PostgreSQL persistence for catalogue references passed the opt-in integration test. The 36 curated English, Mathematics and Science lessons were selected from broad public topic categories; they are original HomeLearn content and claim no official curriculum mapping.

## Approved sequence adjustment — 20 November 2026

HL-002 now has a partial local implementation: parent login, private account provisioning and one-family API authorization. Its migration still needs applying and the family/learner screens and security acceptance evidence remain pending. No physical-device or LAN API access is enabled. Remaining HL-003 onboarding/UI/persistence depends on family/learner management. See [parent login change record](../changes/parent-login-family-access.md) and [HL-003A scope](../changes/HL-003A-configuration-domain.md).
