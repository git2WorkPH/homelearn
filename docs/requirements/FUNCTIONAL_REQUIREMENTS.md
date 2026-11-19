# Functional requirements

Status: Draft specification; every requirement is currently NOT_STARTED.

| ID | Required behaviour | Priority |
|---|---|---|
| FR-001 | Adult registration/authentication; family creation, memberships, multiple learners, preferences and server-side family isolation | P0 |
| FR-002 | Resumable onboarding: mode, learners, preferences, goals and initial plan; reversible mode selection without data loss | P0 |
| FR-003 | Subjects, custom outcomes, learner goals, reusable curriculum templates, versioned official references and provenance | P0 |
| FR-004 | Editable plans and activities, one or more learner assignments, optional scheduling, rescheduling history and reusable lesson templates | P0 |
| FR-005 | Scheduled and unplanned learning records, dated observations, evidence/outcome links and explicit assessments independent of completion | P0 |
| FR-006 | Private original photographs/documents; portfolios filtered by learner, date, subject and goal; export records and evidence references | P0 |
| FR-007 | Progress and portfolio summaries, PDF export, optional assessment methods and identification of outcomes with limited evidence | P0 |
| FR-008 | Small original early-primary/primary starter library with provenance and educational review | P0 |
| FR-009 | Optional provider adapter for labelled suggestions; validated output, explicit parent approval, no autonomous record changes or unapproved external learner-data transmission | P1 |

Configuration applies family → learner → learner-subject → activity precedence independently to curriculum, pedagogy, scheduling and assessment. Missing fields inherit; explicit empty values clear only where supported. Collections replace rather than implicitly merge. Invalid combinations require parent resolution. These detailed semantics are proposed for approval.

No teaching philosophy is embedded in domain branching. Shared activities retain per-learner progress. Changing defaults must not rewrite historical records.

20 November 2026 status update: FR-002 is PARTIAL through HL-003A configuration domain. Field-wise precedence, explicit list clearing, replacement and catalog validation are implemented and tested. Other FR-002 workflows and all remaining functional requirements remain NOT_STARTED.
