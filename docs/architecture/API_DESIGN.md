# API design

Status: Parent email/password authentication and family authorization are implemented locally. The auth/family migration is prepared but not applied by this change. Account creation is available through a local setup command; public sign-up is disabled.

Fastify presentation validates Zod requests, resolves authenticated actor context, invokes use cases and maps typed errors. Domain invariants remain independently enforced. A family identifier in a URL never proves membership.

Resource groups under /api/v1 include catalogue, lesson-versions, lesson-drafts, plans, activities, learning-experiences, learner-records, curricula and assessments. All routes require an authenticated adult and a server-resolved family context except the read-only shared catalogue and `/health`. The context currently requires exactly one family membership; the client cannot select or assert another family. Existing request family IDs are checked against the membership, and repositories scope every family-owned read by that server-resolved ID. `GET /catalogue/lessons` accepts optional `level`, `learningArea` and `q` filters; `GET /catalogue/coverage` returns level × area targets and gaps; catalogue routes are public because they contain no family data. `GET /lesson-versions?familyId=...` and `POST /lesson-versions` list/create immutable family lesson versions. `POST /lesson-drafts` returns a validated but unsaved optional local AI draft. Activities and learner records may reference either a family lesson version or a catalogue lesson, in separate fields. Better Auth handles `/api/auth/*`; email/password sign-up is disabled on the HTTP server.

Key operations include CreateFamily, ResolveLearningConfiguration, CreateLearningPlan, RescheduleActivity, RecordLearningExperience, RecordOutcomeAssessment, InitiateEvidenceUpload, FinaliseEvidenceUpload and ExportLearningSummary.

Use scoped pagination, bounded query filters, explicit response schemas and stable error codes. Implemented mappings include invalid input 400, missing session 401, unavailable family context 403, inaccessible resource 404 where existence must be concealed, and revision conflict 409. Responses exclude stack traces and storage credentials.

Retryable creation accepts scoped idempotency keys with request consistency checks. Updates use revision preconditions to prevent silent overwrites. Exact retention and response conventions need contract approval.

Upload initiation checks ownership and limits; finalisation verifies object identity, size/type and scan state before evidence becomes readable. Download and export retrieval recheck authorisation. Signed links expire quickly; report content and logs must not persist bearer URLs.
