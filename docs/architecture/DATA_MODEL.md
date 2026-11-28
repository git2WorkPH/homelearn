# Relational data model

Status: Existing planning/learning schema includes family-authored lesson versions from migration `0002_family_lessons`; catalogue references use `0003_catalogue_lesson_references`. This change prepares additive migration `0004_parent_auth_family_access` for Better Auth identities/sessions, Family/FamilyMember, family foreign keys and optional curriculum family scope. Earlier custom curriculum versions with no family owner are assigned to `legacy-unassigned` to prevent accidental disclosure. The user reported an earlier migration was applied; this change did not connect to the database, so application of `0004` is still unverified.

Use UUID primary keys. Family-owned tables carry non-null family_id. Parent tables expose unique (family_id, id) pairs; child relationships use composite foreign keys to reject cross-family links. Index scoped lookup and timeline paths. Membership is unique by (family_id, user_id).

| Tables | Key relationships |
|---|---|
| user, account, session, verification | Better Auth adult identities, email/password credential hash and revocable persistent sessions |
| Family, FamilyMember | User-to-family membership and parent role; current API resolves exactly one membership per user |
| learners | Family-owned; no required user relationship |
| lesson_versions | Family-authored immutable lesson versions; structured subject, strand, learning level, goal, success criteria, materials, steps, adaptations, duration, creation method, AI provider/model provenance and parent approval timestamp |
| curricula, curriculum_versions, subjects, subject_strands, learning_outcomes | Outcomes reference immutable published versions; subjects/strands have stable keys and versioned labels, support family-defined extensions, and associate explicit learning-level keys |
| lesson_templates, lesson_versions, lesson_steps, lesson_materials, lesson_adaptations | Reusable lessons belong to a published content pack or family. Immutable versions preserve subject/strand, tagged levels, learning intent, prerequisites, materials, prep/time, ordered steps/prompts, adaptations, safety/accessibility notes, authorship, editorial reviewer/date, provenance and licence |
| content_packs, coverage_scopes, coverage_items, lesson_review_events | Pack version defines intended topic/level scope and target lesson coverage. Each coverage item records subject/strand/level, status, planned scope, draft/published counts and last review. Review events record status transition, reviewer, date and rationale |
| learner_goals | Learner to versioned outcome or custom goal |
| learning_configurations | Validated scope: family, learner, learner-subject or activity; unique scope; schema version |
| learning_plans, activities, activity_assignments | Assignments join activity and learner uniquely. Activities carry optional family lesson-version and shared catalogue references in separate fields; catalogue references identify an immutable source-controlled pack/version/lesson and do not mutate it |
| activity_schedule_revisions | Previous/new schedule, actor and timestamp |
| learning_experiences, learning_records | Experience optionally references a planned activity; records belong to individual learners and carry optional family lesson-version and shared catalogue references, whether planned or discovered through the experience |
| observations, outcome_assessments | Learner record/goal, author, date, explicit assessment criteria and judgement |
| evidence, record_evidence, outcome_evidence | Private object metadata and family-consistent associations |
| report_exports, audit_events | Scoped export lifecycle and minimal change metadata |

Shared catalogue content is immutable, source-controlled and versioned; it remains explicitly separate from family lesson versions. Optional `catalogLessonRef` strings on activities and learner records point to a stable pack/version/lesson reference. Because pack content is not stored in PostgreSQL, the reference has no SQL foreign key; the API validates it against the known catalogue. Historical pack versions must remain resolvable. The new columns/indexes are in migration `0003_catalogue_lesson_references`; PostgreSQL persistence of catalogue references passed the opt-in integration test. Catalogue coverage is a declared target and draft count, not reviewed/official coverage. Lesson completion remains separate from outcome assessment.

Use created_at, updated_at, created_by and appropriate revision counters. Store instants consistently and retain scheduling timezone/local-date semantics. Birth date is optional pending minimisation decision. Validate configuration JSON with versioned schemas; relational ownership and references stay outside opaque JSON.

Proposed lifecycles: curriculum draft/published/superseded; activity draft/planned/archived; evidence pending/quarantined/accepted/rejected; export pending/ready/failed/expired. Record corrections retain attributable history. Archive is distinct from deletion.

No cascading family deletion until retention policy is approved. Define database/object/backup purge and recovery semantics together. Prisma migrations must be reviewed, append-only after application, tested against a real disposable PostgreSQL instance and accompanied by recovery guidance. Never delete applied migrations to repair history.
