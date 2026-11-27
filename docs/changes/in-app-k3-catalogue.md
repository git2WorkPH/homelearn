# In-app K–3 lesson catalogue

Authorization: user approved building a HomeLearn-native catalogue experience based on the year/subject/topic discovery pattern at [SkillrHub Learn](https://skillrhub.com/learn/). Use the site only as a navigation reference; do not copy its content, branding or curriculum text.

Observed gap: the main Lessons tab presents illustrative demo ideas and sends parents to a separate local API workflow to browse the shared K–3 pack. This separates the approved starter lessons from the primary lesson discovery experience.

Scope: open the existing shared HomeLearn catalogue from the Lessons tab in a native full-screen view; browse by learning level and learning area, search lesson/topic text, inspect a full lesson guide including its Bible connection and safety/access notes, and add a selected lesson to a weekly plan. Preserve the existing local API catalogue and workspace paths. No external site embedding, third-party content ingestion, NSW mapping, new dependencies, authentication, or catalogue content changes.

Acceptance criteria:

1. A parent can open and close the shared catalogue from Lessons without leaving the HomeLearn app.
2. The parent can select Kindergarten–Year 3, select a learning area, and search the available shared starter lessons.
3. Each result identifies its level, learning area, strand/topic, and duration; selection reveals the existing guide fields and original Bible connection.
4. Adding a lesson creates a planned activity linked to the exact catalogue version; an activity does not imply mastery.
5. Empty/error states make API availability and catalogue gaps clear; existing local API catalogue access remains available.

Impact: mobile presentation only; uses the existing read-only catalogue and planning APIs. No schema or migration changes. Uses existing synthetic local family/learner IDs; does not access personal learner data or send information to SkillrHub.

Implementation: add a native full-screen catalogue opened from the main Lessons tab. The shared page loads the existing catalogue/coverage APIs, filters by K–3 level and learning area, searches topic content, shows a complete parent-facing guide, and creates a plan/activity with the stable catalogue reference. The separate local API catalogue remains accessible from its workspace. No catalogue content, schema, dependencies or migrations changed.

Verification: `pnpm --filter @homelearn/mobile typecheck`, targeted Oxlint for changed mobile files, `pnpm --filter @homelearn/mobile build` (iOS Expo export), and `git diff --check` pass. Automated tests were not added or run. The iOS export validates bundling, not simulator/device presentation or runtime API connectivity. The local API remains unauthenticated; use only the existing loopback/synthetic-data setup.
