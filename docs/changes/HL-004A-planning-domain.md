# HL-004A — Planning domain foundations

Authorised by continuation request “let us continue with the next task”, following the established backlog. Implement pure domain entities/rules for plans, activities, learner assignments, optional schedules and schedule revision history. Authentication, family persistence, API/UI, curriculum integration and records are excluded. IDs and ownership are passed in by future application use cases; no authorization is claimed here.

## Verification — 20 November 2026

PASS: planning domain tests cover scheduled/unscheduled activities, shared assignments, rescheduling history, invalid schedules, duplicate learners and family mismatch. Full workspace quality gates pass; see final commit evidence in this record. Planning remains pure domain logic with no API or persistence.
