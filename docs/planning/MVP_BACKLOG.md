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
| HL-008 | Parent-facing lesson catalogue flows: browse, filter, preview, adapt a lesson into a family activity, and link an existing family experience to selected lesson versions | HL-011 catalogue services and HL-012 reviewed content packs | AC-012 |
| HL-009 | Accessibility, recovery and complete security/E2E acceptance | P0 features and operational policies | AC-013–015, AC-017–018 |
| HL-010 | Optional local AI adapter and parent-review workflow for lesson drafts | Ollama availability and model choice | AC-016 |
| HL-011 | Complete shared catalogue capabilities: configurable taxonomy/strands, editorial review workflow, content-pack authoring and detailed subject × strand × level coverage beyond the initial read-only service | Initial catalogue implementation; approved editorial/content scope | Parents can distinguish reviewed/published lessons from drafts; coverage gaps and outdated cells remain visible |
| HL-012 | Author and review original lesson packs across the approved K–12 subject/strand/level scope; define versioned topic and lesson targets before claiming completion | HL-011; content scope and editorial capacity | Every planned coverage cell is auditable; published availability and complete-to-defined-scope are distinct |
| HL-013 | Verify authoritative NSW syllabus sources and versions, then design and implement optional provenance-preserving outcome mappings | HL-011/012; user approval; authoritative source review | Official references are dated/versioned and separated from family goals; no compliance-certification claims |

First implementation proposal HL-001 affects root manifests/configuration, apps/, packages/contracts/, tests/, tooling/ and compose configuration. No authentication, child data or production hosting in that task. Record exact files and dependencies before approval. Recovery preserves user work; no removal or rollback deletion is pre-authorised.

HL-001 update, 20 November 2026: implementation authorised in chat and foundation created. Automated checks and iOS bundle export pass; native device E2E/signing and live database checks remain unrun. See [foundation evidence](../changes/HL-001-foundation.md). HL-002 is not yet authorised.

HL-003A: approved pure learning configuration domain extracted from HL-003, sequenced immediately after foundation. Covers precedence, validation, clearing, independent learners and detached snapshots. Authentication remains deferred; no API/UI/persistence in this task.

HL-003B status: pure versioned curriculum domain and in-memory API routes are locally verified; durable curriculum persistence remains pending. HL-004A planning domain is implemented and tested. Planning and learning API/persistence were subsequently approved and implemented for local synthetic-data use without authentication; see [HL-004B](../changes/HL-004B-planning-learning-api.md) and [HL-004C](../changes/HL-004C-planning-learning-workflows.md). Family access control, authentication, evidence and portfolio remain deferred.

20 November 2026 catalogue decision: taxonomy, level labels, lesson template and review/coverage definitions were specified. The initial catalogue implementation is recorded below; NSW mapping and full original reviewed K–12 content remain deferred to HL-012–HL-013. Other deferred MVP work remains in HL-002 (authentication/family/learners), HL-006 (evidence/portfolio), HL-007 (reports) and HL-009 (full accessibility, recovery and end-to-end acceptance); AI remains optional P1 in HL-010.

22 November 2026 scope update: user authorised a HomeLearn-owned lesson creation workflow (no Chalkie integration), with manual authoring and optional local Ollama drafts, followed by parent-approved lesson-version links to activities and learning records. The current change implements a local-API milestone; full catalogue coverage, lesson revision UI, editorial review, NSW mapping, authentication and cross-family authorization remain in backlog. See [family experience lesson linking change record](../changes/family-experience-lesson-linking.md).

23 November 2026 catalogue implementation update: initial HL-011 slice provides source-controlled K–3 draft lessons (56 total), read-only catalogue/search/coverage endpoints for all K–12 display levels, and mobile browse-to-plan linking. Migration `0003_catalogue_lesson_references` is prepared but not applied. All drafts need parent review; editorial tooling, reviewed content for later levels, language packs, and NSW mapping remain outstanding. See [catalogue change record](../changes/k-3-starter-lesson-catalogue.md).
