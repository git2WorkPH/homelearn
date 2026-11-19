# Change log and justification

## 19 November 2026 — iOS frontend and Prisma specification update

Authorisation: user approved updating specifications to React Native/Expo for iPhone/iPad and requested Prisma instead of Drizzle unless a strong technical objection existed. No blocking objection identified. This is documentation-only authorisation.

Changes: align AGENTS.md baseline and architecture, data, roadmap/backlog, scope, acceptance and traceability terminology. Replace planned Next.js/Tailwind/shadcn web UI with native UI; defer web/Android and browser E2E, while preserving required native workflow coverage. Prisma replaces Drizzle in backend persistence. Original baseline entry below is retained as history.

Rationale: build directly for the intended devices and honour the preferred ORM without changing family isolation or Clean Architecture. No implemented UI, tests, schemas or dependencies are removed: none exist. Native test tools, authentication, distribution, offline behaviour and exact dependency versions remain open. Prisma constraints and migrations require review against the selected version.

Validation: inspect remaining old-stack references and local Markdown links; no application checks are available. No packages, migrations, branch changes, commits or external builds are authorised or performed.

## 19 November 2026 — Initial documentation baseline

Authorisation: the user replied “approved” to the explicit request to create the proposed documentation set only. This authorises these draft documents, not application implementation, dependency installation, branch changes, commits or pushes.

Change: add 19 Markdown files in product (3), requirements (5), architecture (6), decisions (1), planning (3) and changes (1).

Why: turn the master prompt and discovery proposal into reviewable, linked requirements, acceptance criteria, domain/data/API/security designs and bounded implementation tasks. FR-001–FR-009 and proposed NFR-001–NFR-009 are mapped to acceptance or quality gates.

Architecture/security impact: documentation only. Detailed design choices remain proposed. No schemas, runtime behaviour, dependencies or security controls were implemented. No removals or existing-file edits are part of this task.

Governance: apply installed continuity-documentation and related discovery/planning/change workflows; HomeLearn's docs/ layout is canonical. Do not duplicate global governance rules.

Validation: inspect document inventory, local links, status labels and repository diff. Application lint/typecheck/test/build are NOT RUN because no application tooling exists. Documentation approval does not establish acceptance of product behaviour.

Known limitations: authentication, configuration details, catalog ownership, upload scanning, operational policies and legal/regulatory applicability remain open in [risks and assumptions](../planning/RISKS_AND_ASSUMPTIONS.md).

Handover: review the documents, resolve foundation choices and obtain explicit scoped approval for HL-001. Observed Git before document creation: master tracking origin/master, untracked README.md. No branch switch or commit performed.
