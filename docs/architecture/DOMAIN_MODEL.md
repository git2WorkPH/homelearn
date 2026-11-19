# Domain model

Status: Proposed. [Data model](DATA_MODEL.md) describes persistence separately.

| Module | Owns | Public responsibilities |
|---|---|---|
| Identity/access | Adult identity and sessions | Authenticate actor |
| Family | Family and adult membership | Resolve authorised family context |
| Learner | Learner profiles | Create/update/archive learner |
| Curriculum | Curriculum versions, subjects, outcomes, learner goals | Resolve versioned references and goals |
| Configuration | Scoped preferences and definitions | Resolve validated effective settings |
| Planning | Plans, activities, assignments, schedule history | Plan and reschedule learning |
| Learning records | Experiences, learner records, observations, assessments | Record actual learning and explicit judgement |
| Evidence | Objects, upload lifecycle, evidence links | Authorise storage and evidence associations |
| Reporting | Export metadata and read projections | Produce scoped summaries |
| Optional AI | Suggestions and approval state | Generate draft suggestions |

Family membership is checked by use cases; repositories also require explicit family context. Curriculum and learner references are validated through public ports. Core modules never depend on AI or reporting.

An activity is an intention. A learning experience records what happened and may reference an activity. Learner-specific records support different participation and observations in a shared experience. OutcomeAssessment is a separate parent judgement, optionally supported by evidence; completion never creates mastery automatically.

LearnerGoal associates a learner with a versioned outcome or family-defined goal. OutcomeEvidence is a link, not an assessment. Absence of evidence means limited recorded evidence, not inability.

Configuration resolution is deterministic, field-wise and independently evaluated per learner. Historical records retain effective settings/provenance. Proposed mode scope is an adult UI preference; approval is pending.
