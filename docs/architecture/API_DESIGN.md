# API design

Status: Contract conventions; lesson-version creation/draft routes and planning/learning lesson references are implemented in the local API by this change. Authentication remains deferred.

Fastify presentation validates Zod requests, resolves authenticated actor context, invokes use cases and maps typed errors. Domain invariants remain independently enforced. A family identifier in a URL never proves membership.

Resource groups under /api/v1 include lesson-versions, lesson-drafts, plans, activities, learning-experiences, learner-records and assessments; families, learners, evidence and exports remain proposed. `GET /lesson-versions?familyId=...` and `POST /lesson-versions` list/create immutable family lesson versions. `POST /lesson-drafts` returns a validated but unsaved optional local AI draft. Activities and learner records may reference a lesson version. Provider-specific authentication routes remain undecided.

Key operations include CreateFamily, ResolveLearningConfiguration, CreateLearningPlan, RescheduleActivity, RecordLearningExperience, RecordOutcomeAssessment, InitiateEvidenceUpload, FinaliseEvidenceUpload and ExportLearningSummary.

Use scoped pagination, bounded query filters, explicit response schemas and stable error codes. Suggested mappings: invalid input 400, missing session 401, forbidden operation 403, inaccessible resource 404 where existence must be concealed, revision conflict 409. Responses exclude stack traces and storage credentials.

Retryable creation accepts scoped idempotency keys with request consistency checks. Updates use revision preconditions to prevent silent overwrites. Exact retention and response conventions need contract approval.

Upload initiation checks ownership and limits; finalisation verifies object identity, size/type and scan state before evidence becomes readable. Download and export retrieval recheck authorisation. Signed links expire quickly; report content and logs must not persist bearer URLs.
