# Relational data model

Status: Proposed logical schema; no migration or physical schema exists.

Use UUID primary keys. Family-owned tables carry non-null family_id. Parent tables expose unique (family_id, id) pairs; child relationships use composite foreign keys to reject cross-family links. Index scoped lookup and timeline paths. Membership is unique by (family_id, user_id).

| Tables | Key relationships |
|---|---|
| users, auth_identities, sessions | Adult identities only; provider/session details pending auth choice |
| families, family_members | User-to-family membership and role |
| learners | Family-owned; no required user relationship |
| curricula, curriculum_versions, subjects, learning_outcomes | Outcomes reference immutable published versions; official source and licence metadata preserved |
| learner_goals | Learner to versioned outcome or custom goal |
| learning_configurations | Validated scope: family, learner, learner-subject or activity; unique scope; schema version |
| learning_plans, activities, activity_assignments | Assignments join activity and learner uniquely |
| activity_schedule_revisions | Previous/new schedule, actor and timestamp |
| learning_experiences, learning_records | Experience optionally references activity; records belong to individual learners |
| observations, outcome_assessments | Learner record/goal, author, date, explicit assessment criteria and judgement |
| evidence, record_evidence, outcome_evidence | Private object metadata and family-consistent associations |
| report_exports, audit_events | Scoped export lifecycle and minimal change metadata |

Global published starter/reference content must be explicitly distinguished from family content, with no family-edit path to global rows. The precise catalog schema is a design decision before migrations.

Use created_at, updated_at, created_by and appropriate revision counters. Store instants consistently and retain scheduling timezone/local-date semantics. Birth date is optional pending minimisation decision. Validate configuration JSON with versioned schemas; relational ownership and references stay outside opaque JSON.

Proposed lifecycles: curriculum draft/published/superseded; activity draft/planned/archived; evidence pending/quarantined/accepted/rejected; export pending/ready/failed/expired. Record corrections retain attributable history. Archive is distinct from deletion.

No cascading family deletion until retention policy is approved. Define database/object/backup purge and recovery semantics together. Prisma migrations must be reviewed, append-only after application, tested against a real disposable PostgreSQL instance and accompanied by recovery guidance. Never delete applied migrations to repair history.
