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
| 5 Evidence/reports | Safe private uploads, portfolios, PDF exports | AC-009–011, AC-013 | High |
| 6 MVP acceptance | Original content, accessibility, recovery and complete journeys | Remaining P0 criteria and quality gates | High |
| 7 Optional AI | Expand local AI beyond lesson drafts to other validated suggestions; preserve parent review and AI-disabled core workflows | AC-016 plus AI-disabled regression | Medium–high |

Each milestone includes traceability, change justification, tests and review. Dependencies follow the sequence; content design may proceed alongside core workflows when separately authorised. Calendar estimates await authentication, storage and hosting decisions.

Current implementation: family lesson authoring, optional local AI drafting and version linking are in progress in the local API workflow. The additive migration is prepared but unapplied. No commit, push, deployment or database migration execution is included.

## Approved sequence adjustment — 20 November 2026

After HL-001, implement HL-003A configuration domain and tests before authentication. HL-002 is deferred, not removed from MVP. No educational API or real family data may be enabled before authentication and family isolation. Remaining HL-003 onboarding/UI/persistence still depends on HL-002. See [change scope](../changes/HL-003A-configuration-domain.md).
