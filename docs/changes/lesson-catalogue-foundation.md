# K–12 lesson catalogue foundation

Authorization: user requested implementing the first three catalogue-planning items: subject areas and K–12 level labels, a standard lesson-content template, and review/coverage tracking. The user explicitly deferred NSW syllabus references. User also requested that deferred catalogue and existing deferred product work remain in the product backlog.

Scope: clarify these three design requirements in product requirements and the proposed logical model; update the interactive prototype to demonstrate the catalogue structure, lesson fields and illustrative coverage workflow; record follow-on implementation/content and NSW mapping in the backlog. No NSW syllabus content, production lesson packs, persistence/API/editorial tooling, schema migrations, dependency changes, authentication, evidence or portfolios are included.

Rationale: make the content expectations reviewable before investing in a full K–12 authoring and delivery system. Subject and level combinations must be visible, lesson variants must be meaningful for the selected level, and published availability must be distinct from complete coverage.

Compatibility and data impact: prototype-only local state and sample records; no production data or backend behavior changes. Lesson versions and coverage tables remain proposed logical design, not a physical schema.

Verification: mobile interaction test covers level selection, coverage view, lesson fields and no-official-mapping caveat; run Oxlint, mobile TypeScript, Jest and iOS Expo export; record exact outcomes below.

## Verification

PASS: targeted Oxlint; `tsc -p apps/mobile/tsconfig.json --noEmit`; mobile Jest (2 tests); iOS Expo export from `apps/mobile`; `git diff --check`.

Limitations: taxonomy, coverage rows and lesson metadata in the prototype are illustrative/local-only. No content pack, lesson persistence, editorial approval, NSW reference mapping or production coverage claim is implemented.
