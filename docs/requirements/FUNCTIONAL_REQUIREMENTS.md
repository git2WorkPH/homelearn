# Functional requirements

Status: Draft specification; every requirement is currently NOT_STARTED.

| ID | Required behaviour | Priority |
|---|---|---|
| FR-001 | Adult registration/authentication; family creation, memberships, multiple learners, preferences and server-side family isolation | P0 |
| FR-002 | Resumable onboarding: mode, learners, preferences, goals and initial plan; reversible mode selection without data loss | P0 |
| FR-003 | Subjects, custom outcomes, learner goals, reusable curriculum templates, versioned official references and provenance | P0 |
| FR-004 | Editable plans and activities, one or more learner assignments, optional scheduling, rescheduling history and reusable lesson templates; parents can adapt a selected lesson into a family activity while preserving the source lesson version | P0 |
| FR-005 | Scheduled and unplanned learning records, dated observations, evidence/outcome links and explicit assessments independent of completion; parents can optionally link an observed family experience to selected lesson versions | P0 |
| FR-006 | Private original photographs/documents; portfolios filtered by learner, date, subject and goal; export records and evidence references | P0 |
| FR-007 | Progress and portfolio summaries, PDF export, optional assessment methods and identification of outcomes with limited evidence | P0 |
| FR-008 | Level-aware lesson catalogue spanning Kindergarten and Years 1–12 across extensible learning areas/strands; parents can author original family lessons with learning intent, level, materials, steps, adaptations and estimated time; immutable lesson versions preserve provenance and links from activities/records | P0 |
| FR-009 | Optional local AI lesson drafting; labelled, schema-validated drafts remain unsaved until parent review and approval; generation cannot alter records or claim official curriculum alignment | P1 |

Configuration applies family → learner → learner-subject → activity precedence independently to curriculum, pedagogy, scheduling and assessment. Missing fields inherit; explicit empty values clear only where supported. Collections replace rather than implicitly merge. Invalid combinations require parent resolution. These detailed semantics are proposed for approval.

K–12 catalogue requirement: content coverage is a product acceptance target, not a claim that the current prototype contains a complete lesson library. Use the proposed subject and strand catalogue in [the lesson catalogue plan](LESSON_CATALOGUE_PLAN.md), with configurable labels including Kindergarten and Years 1–12. Ship reviewed content in subject/strand/level packs with explicit coverage status; distinguish “available” from “complete to defined scope”. Allow family-defined subjects and goals, and keep lesson completion separate from outcome assessment. Original authored content must carry authorship, version, review and licence/provenance metadata. NSW syllabus references, official mappings and jurisdiction-specific completeness claims are explicitly deferred.

No teaching philosophy is embedded in domain branching. Shared activities retain per-learner progress. Changing defaults must not rewrite historical records.

20 November 2026 status update: FR-002 is PARTIAL through HL-003A configuration domain. Field-wise precedence, explicit list clearing, replacement and catalog validation are implemented and tested. Other FR-002 workflows and all remaining functional requirements remain NOT_STARTED.
