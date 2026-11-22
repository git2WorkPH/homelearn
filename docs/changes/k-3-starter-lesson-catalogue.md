# K–3 starter lesson catalogue

Authorization: user approved building the proposed first catalogue slice on 23 November 2026: support all Australian display levels (Kindergarten–Year 12), provide two original starter lessons per level for Kindergarten–Year 3 across seven learning areas, show uncovered levels/areas honestly, and let a parent use a chosen catalogue lesson in family planning. Languages remain in the taxonomy but have no shared starter content until a language is selected. NSW syllabus mapping remains deferred.

Current evidence: the local API serves a versioned, source-controlled catalogue pack with 56 original drafts and coverage for all 13 display levels and eight learning areas. Mobile users can browse, search and filter lessons, inspect parent-review status and add a selected lesson to a weekly plan. Catalogue references are carried into planned activities and resulting learning records. The Prisma migration adding nullable references has been generated but not applied.

Chosen approach: ship an immutable, source-controlled content pack with a stable pack version and stable lesson references; expose read-only search and coverage endpoints; keep shared catalogue entries distinct from family-authored lesson versions; store optional catalogue references on planned activities and learner records. Starter content is labelled as requiring parent review. No external lesson source or official curriculum alignment is claimed.

Scope: 56 original draft lessons (2 × 4 levels × 7 learning areas), catalogue browse/search/level/area filters, coverage gap reporting for all 13 levels and the eight catalogue learning areas, and parent-selected links into planning/learning records. Cross-curricular topics remain tags/ideas rather than a new core learning area. No language-specific pack, NSW mappings, editorial administration, authentication, publication claims, remote AI, worksheets or commercial materials.

Data and privacy impact: adds only non-identifying curriculum content and optional versioned catalogue references. Existing family ownership and authentication limitations remain unchanged. No child profiles or observations are sent to the catalogue module.

Test decisions: keep existing family-authored lesson, plan, learning-record and prototype workflows. Existing API and mobile test fixtures were updated for catalogue calls/references. No test suites were run in this execution. PostgreSQL integration coverage for durable catalogue references remains to be run after migration deployment and approval.

Verification: API and mobile typechecks, Oxlint, API build, iOS Expo export and `git diff --check` pass. Test suites were not run. Prisma client generation passed against the updated schema. Migration `0003_catalogue_lesson_references` is present and unapplied. See handover for remaining validation limitations.

Recovery: the content pack is immutable and additive. Existing `lessonVersionId` family-authored links and records remain intact; new catalogue links are optional nullable references. No data deletion or migration rollback is pre-authorized.

## Follow-up — Bible-inspired starter lessons

Authorization: user clarified that the K–3 shared starter catalogue should be Bible-inspired and selected passage references with child-friendly paraphrases in original wording (no Bible-translation quotations).

Change: add a Bible connection (passage reference, original paraphrase, reflection prompt) to every starter lesson, display it in the lesson detail, update the pack version to `2026.2`, and revise the catalogue requirements. The reflection is supplementary to subject learning, factual instruction and parent judgement. Family-authored lessons are unchanged.

Content basis: references were checked against Bible passage pages for [Proverbs 16:24](https://www.bible.com/bible/111/PRO.16.24.NIV), [Luke 14:28](https://www.bible.com/bible/111/LUK.14.28.NIV), [Psalm 111:2](https://www.bible.com/bible/111/PSA.111.2.NIV), [Micah 6:8](https://www.bible.com/bible/111/MIC.6.8.NIV), [Exodus 35:31–32](https://www.bible.com/bible/111/EXO.35.31-32.NIV), [Psalm 150:4](https://www.bible.com/bible/111/PSA.150.4.NIV), and [1 Timothy 4:8](https://www.bible.com/bible/111/1TI.4.8.NIV). Paraphrases were written in original language and are not quotations. A lesson step now invites the family to read its chosen Bible translation or use the original paraphrase. The content remains `needs-parent-review`; no denomination-specific statement is intended.

Verification: pending final typecheck/lint/build checks. Test suites are not run in this execution.
