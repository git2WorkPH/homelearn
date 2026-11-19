# MVP backlog

Status: Proposed tasks, not implementation authorisation.

| Task | Scope and justification | Dependencies | Acceptance |
|---|---|---|---|
| HL-001 | Workspace, strict TS, Expo iOS/Fastify shells, Oxlint, backend Vitest and approved native test setup, boundary checker and local PostgreSQL; establish executable gates | Approved dependencies/package manager/branch | Health endpoint, build and quality commands work; invalid import is detected |
| HL-002 | Maintained auth integration, family membership and learners; establish ownership before educational data | HL-001, auth decision | AC-001, AC-013 |
| HL-003 | Mode/onboarding/configuration and versioned goals | HL-002, configuration decisions | AC-002–005 |
| HL-004 | Plans, shared assignments, schedule revisions | HL-003 | AC-006 |
| HL-005 | Actual learning, observations and explicit assessments | HL-004 | AC-007–008 |
| HL-006 | Private uploads, lifecycle and portfolio | HL-005, storage/scan policy | AC-009–010, AC-013 |
| HL-007 | Authorised PDF and evidence-reference export | HL-006, PDF tooling approval | AC-011 |
| HL-008 | Original templates and educational review | Curriculum/template contracts | AC-012 |
| HL-009 | Accessibility, recovery and complete security/E2E acceptance | P0 features and operational policies | AC-013–015, AC-017–018 |
| HL-010 | Optional AI adapter and review workflow | Separate P1 approval | AC-016 |

First implementation proposal HL-001 affects root manifests/configuration, apps/, packages/contracts/, tests/, tooling/ and compose configuration. No authentication, child data or production hosting in that task. Record exact files and dependencies before approval. Recovery preserves user work; no removal or rollback deletion is pre-authorised.

HL-001 update, 20 November 2026: implementation authorised in chat and foundation created. Automated checks and iOS bundle export pass; native device E2E/signing and live database checks remain unrun. See [foundation evidence](../changes/HL-001-foundation.md). HL-002 is not yet authorised.

HL-003A: approved pure learning configuration domain extracted from HL-003, sequenced immediately after foundation. Covers precedence, validation, clearing, independent learners and detached snapshots. Authentication remains deferred; no API/UI/persistence in this task.

HL-003B status: pure versioned curriculum domain, in-memory API routes and Prisma schema/client setup are locally verified. Durable repository/migration remain deferred; do not treat API data as persistent. HL-004A planning domain is implemented and its tests pass; API/persistence remain pending family access.
