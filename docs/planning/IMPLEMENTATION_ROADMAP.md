# Implementation roadmap

Status: Proposed. Only documentation creation is authorised.

| Milestone | Outcome | Exit criteria | Complexity |
|---|---|---|---|
| 0 Specifications | This documentation set and resolved blocking decisions | Owner reviews scope, model and security design | Medium |
| 1 Foundation | Approved workspace/dependencies, app shells, local services and quality gates | Build, health endpoint, lint/typecheck/tests and boundary checks | Medium |
| 2 Family access | Authentication, family membership and learners | AC-001 and isolation tests | High |
| 3 Learning setup | Modes, onboarding, configuration, curriculum/goals | AC-002–005 | High |
| 4 Planning/records | Shared activities, schedule history, spontaneous records, assessments | AC-006–008 | High |
| 5 Evidence/reports | Safe private uploads, portfolios, PDF exports | AC-009–011, AC-013 | High |
| 6 MVP acceptance | Original content, accessibility, recovery and complete journeys | Remaining P0 criteria and quality gates | High |
| 7 Optional AI | Validated suggestions and approval workflow | AC-016 plus AI-disabled regression | Medium–high |

Each milestone includes traceability, change justification, tests and review. Dependencies follow the sequence; content design may proceed alongside core workflows when separately authorised. Calendar estimates await authentication, storage and hosting decisions.

Next action: review this specification and resolve foundation choices before requesting scoped implementation/dependency/branch permission. No commit, push, deployment or migration execution follows from documentation approval.

## Approved sequence adjustment — 20 November 2026

After HL-001, implement HL-003A configuration domain and tests before authentication. HL-002 is deferred, not removed from MVP. No educational API or real family data may be enabled before authentication and family isolation. Remaining HL-003 onboarding/UI/persistence still depends on HL-002. See [change scope](../changes/HL-003A-configuration-domain.md).
