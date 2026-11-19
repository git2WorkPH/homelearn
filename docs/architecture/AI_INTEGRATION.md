# Optional AI integration

Status: Proposed P1; excluded from core implementation milestones.

An application provider port accepts a minimal, explicit suggestion request and returns structured untrusted output. Ollama is an initial candidate adapter. Core domain modules do not import provider SDKs or require a provider to start.

Suggestions may propose plans, activities, teaching explanations, differentiation or summaries. Store provider/model provenance where available and label generated content. Validate schemas and referenced goals; reject invented official mappings. Never claim curriculum compliance.

Lifecycle: generated draft → parent edited/reviewed → approved or rejected. Activation invokes the normal authorised use case after explicit approval. Approval applies to the reviewed version; subsequent edits require renewed review. No autonomous learning-record writes.

Treat prompts, retrieved material and outputs as untrusted. Do not grant suggestion generation storage or write tools. Set request limits, cancellation, timeout and safe error handling. Do not log prompts containing learner narratives.

External transmission requires explicit informed permission for the actual data/provider; local execution does not imply permission to inspect unrelated files. Test malformed output, prompt injection, unsupported claims and complete AI-disabled core journeys.
