# K–12 lesson catalogue plan

Status: Proposed product/content specification. This document defines the catalogue shape, not official curriculum guidance or a completed lesson library. NSW syllabus references and compliance interpretation are explicitly deferred.

## 1. Subject and level catalogue

Use an extensible subject taxonomy. The initial shared catalogue groups learning areas as follows; strands are discoverable filters and planning tags, not a claim of syllabus completeness.

| Learning area | Initial strands / examples |
|---|---|
| English | Oral language; reading and literature; writing; spelling and vocabulary |
| Mathematics | Number; algebra and patterns; measurement; space and geometry; statistics and probability |
| Science | Biological; chemical; physical; Earth and space; scientific inquiry |
| Humanities and social sciences | History; geography; civics and society; economics and business |
| Technologies | Design and technologies; digital technologies; engineering and making |
| The arts | Dance; drama; media arts; music; visual arts |
| Health and physical education | Personal and social wellbeing; movement; games and sport; safety |
| Languages | Family-selected or community languages; listening, speaking, reading and writing |
| Cross-curricular themes | Sustainability and environment; financial literacy; life skills; wellbeing; interdisciplinary inquiry |
| Family-defined | Any additional subject or strand named and organised by the parent |

Subject groups and strands are data, not application branches. A family may add, rename, reorder or hide its own subjects and strands without altering shared definitions or historical records. Shared catalogue labels are versioned so later taxonomy changes do not silently relabel saved plans or records.

### Learning levels

The initial Australian display uses **Kindergarten** and **Year 1** through **Year 12**. Store a stable level key separately from its display label. The taxonomy must permit different jurisdiction labels and family-defined level groupings later; the current content does not assert alignment with an official progression. Lessons identify the levels for which a reviewed variant exists. A lesson is not shown as suitable for every level merely because it appears in the K–12 catalogue.

## 2. Standard lesson template

Every published lesson version contains:

- Identity: title, short description, learning area, strand/topic, stable content ID and version.
- Audience: one or more explicit learning levels, plus a distinct adaptation/variant for each selected level when the activity changes materially.
- Learning intent: one or more parent-readable, observable goals; prerequisites or assumed knowledge where useful.
- Preparation: estimated active time, optional preparation time, materials, setup and safety/accessibility notes.
- Teaching plan: sequenced steps with optional timing, parent prompts/questions and learner choice points.
- Adaptations: practical ways to simplify, scaffold, extend or change the mode of participation while keeping the learning intent clear.
- Reflection: optional parent prompts and suggested evidence; recording or assessment remains the parent's choice.
- Provenance: author, original/source classification, version, licence/rights basis, editorial status, reviewer and review date. Third-party materials are linked with permission/rights notes; copied commercial lesson content is not accepted.

Lesson completion creates or updates a planned activity/learning record only. It never creates an outcome mastery judgement. Family edits create a family-owned adaptation linked to the source version; they do not mutate shared published content.

## 3. Editorial review and coverage

### Review lifecycle

`Draft → In review → Published → Superseded` with `Changes requested` returning to Draft. A published version is immutable; corrections create a new version. Retiring content removes it from new discovery while preserving references in family plans and records.

Review checklist before publication:

1. Originality and licence/provenance are recorded and permitted.
2. Learning intent is understandable, observable and appropriate to every tagged level variant.
3. Materials, preparation and steps are complete enough for a parent to use.
4. Adaptations are practical and preserve learner choice and the stated intent.
5. Factual claims are reviewed; safety, accessibility and inclusion notes are appropriate.
6. The reviewer and review date are recorded; no official curriculum alignment or compliance claim is made.

### Coverage inventory

Track coverage at **learning area × strand/topic × level × content-pack version**. Each inventory row records its agreed scope target, published lesson count, status, and last review. Statuses are `Not planned`, `Planned`, `Drafting`, `In review`, `Available`, `Complete to defined scope`, and `Needs update`.

- **Available** means at least one reviewed lesson exists for that exact level and strand/topic; the interface must still show that broader coverage is in progress.
- **Complete to defined scope** means all topics and lesson targets in the versioned content plan for that cell have passed review. The scope and target are explicit and inspectable; a count alone does not imply completeness.
- A missing or outdated cell is shown as a gap. It is never silently inferred from another level, a neighbouring strand, an AI suggestion or an overall subject badge.
- Coverage totals are catalogue-planning signals, not assessment of a learner and not evidence of jurisdictional compliance.

The full K–12 catalogue remains a substantial authoring and review programme. Define and approve the topic/lesson targets for each subject-level cell before claiming complete coverage. The current prototype's lessons and coverage statuses are illustrative only.

## 4. Deferred work

Tracked in [MVP backlog](../planning/MVP_BACKLOG.md): persistent taxonomy/content-pack/lesson-version model and authoring/coverage workflows; original lesson authoring and review across the approved subject/level scope; and later NSW syllabus source verification and mapping. These are not implemented by this design/prototype change.
