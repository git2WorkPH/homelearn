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
| HL-008 | Parent-facing lesson catalogue flows: browse, filter, preview, family-adapt and schedule reviewed lesson content | HL-011 catalogue services and HL-012 reviewed content packs | AC-012 |
| HL-009 | Accessibility, recovery and complete security/E2E acceptance | P0 features and operational policies | AC-013–015, AC-017–018 |
| HL-010 | Optional AI adapter and review workflow | Separate P1 approval | AC-016 |
| HL-011 | Implement shared subject/strand and configurable K–12 level catalogues; versioned lesson/content-pack records; authoring, editorial review lifecycle and subject × strand × level coverage tracker | HL-003B curriculum domain; lesson catalogue design | Parents can browse only level-appropriate published versions; coverage gaps and outdated cells remain visible |
| HL-012 | Author and review original lesson packs across the approved K–12 subject/strand/level scope; define versioned topic and lesson targets before claiming completion | HL-011; content scope and editorial capacity | Every planned coverage cell is auditable; published availability and complete-to-defined-scope are distinct |
| HL-013 | Verify authoritative NSW syllabus sources and versions, then design and implement optional provenance-preserving outcome mappings | HL-011/012; user approval; authoritative source review | Official references are dated/versioned and separated from family goals; no compliance-certification claims |

First implementation proposal HL-001 affects root manifests/configuration, apps/, packages/contracts/, tests/, tooling/ and compose configuration. No authentication, child data or production hosting in that task. Record exact files and dependencies before approval. Recovery preserves user work; no removal or rollback deletion is pre-authorised.

HL-001 update, 20 November 2026: implementation authorised in chat and foundation created. Automated checks and iOS bundle export pass; native device E2E/signing and live database checks remain unrun. See [foundation evidence](../changes/HL-001-foundation.md). HL-002 is not yet authorised.

HL-003A: approved pure learning configuration domain extracted from HL-003, sequenced immediately after foundation. Covers precedence, validation, clearing, independent learners and detached snapshots. Authentication remains deferred; no API/UI/persistence in this task.

HL-003B status: pure versioned curriculum domain and in-memory API routes are locally verified; durable curriculum persistence remains pending. HL-004A planning domain is implemented and tested. Planning and learning API/persistence were subsequently approved and implemented for local synthetic-data use without authentication; see [HL-004B](../changes/HL-004B-planning-learning-api.md) and [HL-004C](../changes/HL-004C-planning-learning-workflows.md). Family access control, authentication, evidence and portfolio remain deferred.

20 November 2026 catalogue decision: the subject/strand taxonomy, Kindergarten–Year 12 level labels, lesson template and editorial/coverage definitions are specified and shown illustratively in the prototype. NSW mapping, persistent catalogue/content-pack implementation, authoring tools and the actual reviewed K–12 content corpus remain deferred to HL-011–HL-013. See [lesson catalogue plan](../requirements/LESSON_CATALOGUE_PLAN.md). Other deferred MVP work remains in HL-002 (authentication/family/learners), HL-006 (evidence/portfolio), HL-007 (reports) and HL-009 (full accessibility, recovery and end-to-end acceptance); AI remains optional P1 in HL-010.
