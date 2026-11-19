# API design

Status: Proposed contract conventions, not implemented endpoints.

Fastify presentation validates Zod requests, resolves authenticated actor context, invokes use cases and maps typed errors. Domain invariants remain independently enforced. A family identifier in a URL never proves membership.

Proposed resource groups under /api/v1: families, learners, curriculum-versions, learner-goals, configurations, plans, activities, learning-records, assessments, evidence and exports. Family-owned routes are nested under /families/:familyId. Provider-specific authentication routes remain undecided.

Key operations include CreateFamily, ResolveLearningConfiguration, CreateLearningPlan, RescheduleActivity, RecordLearningExperience, RecordOutcomeAssessment, InitiateEvidenceUpload, FinaliseEvidenceUpload and ExportLearningSummary.

Use scoped pagination, bounded query filters, explicit response schemas and stable error codes. Suggested mappings: invalid input 400, missing session 401, forbidden operation 403, inaccessible resource 404 where existence must be concealed, revision conflict 409. Responses exclude stack traces and storage credentials.

Retryable creation accepts scoped idempotency keys with request consistency checks. Updates use revision preconditions to prevent silent overwrites. Exact retention and response conventions need contract approval.

Upload initiation checks ownership and limits; finalisation verifies object identity, size/type and scan state before evidence becomes readable. Download and export retrieval recheck authorisation. Signed links expire quickly; report content and logs must not persist bearer URLs.
