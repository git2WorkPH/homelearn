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
| FR-008 | Level-aware shared lesson catalogue spanning Kindergarten and Years 1–12 across extensible learning areas/strands; browse, search and filter versioned packs, expose coverage gaps, and link a selected lesson version to planned activities and learning records. Keep shared catalogue lessons distinct from immutable family-authored lesson versions | P0 |
| FR-009 | Optional local AI lesson drafting; labelled, schema-validated drafts remain unsaved until parent review and approval; generation cannot alter records or claim official curriculum alignment | P1 |

Configuration applies family → learner → learner-subject → activity precedence independently to curriculum, pedagogy, scheduling and assessment. Missing fields inherit; explicit empty values clear only where supported. Collections replace rather than implicitly merge. Invalid combinations require parent resolution. These detailed semantics are proposed for approval.

K–12 catalogue requirement: content coverage is a product acceptance target, not a claim that the current catalogue is complete. Current pack `homelearn-k3-starter@2026.3` contains 68 original Bible-inspired lessons: three curated topic lessons per Kindergarten–Year 3 level in English, Mathematics and Science, plus two retained lessons per level in Humanities and social sciences, Technologies, The arts, and Health and physical education. Each includes a passage reference, original child-friendly paraphrase and reflection prompt, without quoting a Bible translation. All current entries remain marked “needs parent review.” The prior 56-entry pack `2026.2` remains available for references on historical activities and records. Catalogue gaps across all 13 levels and eight areas remain visible; Languages has no shared starter content pending a language choice. SkillrHub's public K–3 topic index informed topic selection only; HomeLearn content is original and does not claim Australian Curriculum or NSW syllabus alignment. Full K–12 coverage and a parent-facing editorial workflow remain outstanding. Preserve pack version and source provenance on activity and learner record references. Faith reflections supplement subject learning and do not replace factual content or parent judgement. Lesson completion stays separate from outcome assessment. NSW syllabus references, official mappings and jurisdictional completeness claims remain deferred.

No teaching philosophy is embedded in domain branching. Shared activities retain per-learner progress. Changing defaults must not rewrite historical records.

20 November 2026 status update: FR-002 is PARTIAL through HL-003A configuration domain. Field-wise precedence, explicit list clearing, replacement and catalog validation are implemented and tested. Other FR-002 workflows and all remaining functional requirements remain NOT_STARTED.
