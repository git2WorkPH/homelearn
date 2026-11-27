# Curated SkillrHub-inspired K–3 topic lessons

Authorization: user requested using SkillrHub's K–3 lessons as a reference and adding original HomeLearn lessons; user selected a curated starter set rather than one lesson for every indexed topic. The public reference snapshot lists approximately 223 topic slots across Foundation–Year 3 Maths, English and Science (50, 55, 55 and 63 respectively): [SkillrHub Learn](https://skillrhub.com/learn/) and [SkillrHub Products](https://skillrhub.com/products/). Reviewed 27 November 2026.

Scope: create three original HomeLearn topic lessons in each of the four levels and three core subjects (36 new lessons). Retain the existing 32 lessons in four other K–3 learning areas. Use broad concept areas to select topics; do not copy SkillrHub wording, examples, questions, activities, branding or curriculum codes. Do not claim Australian Curriculum or NSW syllabus alignment. Lessons retain HomeLearn's Bible connection, with reflection supplementary to factual subject instruction.

Observed state: catalogue pack `homelearn-k3-starter@2026.2` contains 56 lessons (two per level across seven learning areas). Lesson references are persisted on plans and learner records, so changing content in place would make historical references ambiguous.

Chosen approach: publish `2026.3` with 68 current lessons (36 curated English/Maths/Science lessons and 32 retained non-core-area lessons). Preserve all 56 `2026.2` lessons for versioned reference lookup. The current list/coverage endpoints serve `2026.3`; reference lookup resolves current and archived entries. Keep catalogue editorial status as `needs-parent-review`; user approval of the selected scope is not an editorial review record.

Impact: source-controlled content and in-memory catalogue lookup only. No database schema, migration, dependency or family data changes. Coverage targets reflect the current authored counts; current items remain unreviewed. Full coverage of the approximately 223 referenced topic slots remains future content work.

Verification: `pnpm lint`, `pnpm typecheck`, `pnpm --filter @homelearn/api build`, `pnpm --filter @homelearn/mobile build` (iOS Expo export), and `git diff --check` pass. Automated tests were not added or run. The iOS export verifies bundling, not runtime API behavior, simulator/device presentation, or old-reference lookup at runtime. Recovery is additive by pack version; previous references remain retrievable from the archived `2026.2` source data.
