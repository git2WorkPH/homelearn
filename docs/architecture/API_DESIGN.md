# API design

Status: Contract conventions; lesson-version creation/draft routes and planning/learning lesson references are implemented in the local API by this change. Authentication remains deferred.

Fastify presentation validates Zod requests, resolves authenticated actor context, invokes use cases and maps typed errors. Domain invariants remain independently enforced. A family identifier in a URL never proves membership.

Resource groups under /api/v1 include catalogue, lesson-versions, lesson-drafts, plans, activities, learning-experiences, learner-records and assessments; families, learners, evidence and exports remain proposed. `GET /catalogue/lessons` accepts optional `level`, `learningArea` and `q` filters; `GET /catalogue/coverage` returns level × area targets and gaps; `GET /catalogue/lessons/:reference` retrieves a stable versioned pack entry. The starter catalogue is read-only source-controlled content, separate from family lesson versions. `GET /lesson-versions?familyId=...` and `POST /lesson-versions` list/create immutable family lesson versions. `POST /lesson-drafts` returns a validated but unsaved optional local AI draft. Activities and learner records may reference either a family lesson version or a catalogue lesson, in separate fields. Provider-specific authentication routes remain undecided.

Key operations include CreateFamily, ResolveLearningConfiguration, CreateLearningPlan, RescheduleActivity, RecordLearningExperience, RecordOutcomeAssessment, InitiateEvidenceUpload, FinaliseEvidenceUpload and ExportLearningSummary.

Use scoped pagination, bounded query filters, explicit response schemas and stable error codes. Suggested mappings: invalid input 400, missing session 401, forbidden operation 403, inaccessible resource 404 where existence must be concealed, revision conflict 409. Responses exclude stack traces and storage credentials.

Retryable creation accepts scoped idempotency keys with request consistency checks. Updates use revision preconditions to prevent silent overwrites. Exact retention and response conventions need contract approval.

Upload initiation checks ownership and limits; finalisation verifies object identity, size/type and scan state before evidence becomes readable. Download and export retrieval recheck authorisation. Signed links expire quickly; report content and logs must not persist bearer URLs.
