# Optional AI integration

Status: Optional local lesson drafting is implemented behind a provider port; Ollama is the current local adapter. AI is not required by the core flow.

The lesson draft provider accepts only subject, strand, learning level, topic and optional teaching notes. The Ollama adapter is restricted to a loopback HTTP URL and uses the local `/api/generate` endpoint. Core domain modules do not import provider SDKs or require a provider to start.

Lesson suggestions are structured untrusted drafts. The API validates the generated schema and stores provider/model provenance; the mobile workflow labels the draft and requires explicit parent approval before saving. It does not receive learner profiles or learning records, and it cannot autonomously modify activities or records. No official mapping or curriculum compliance claim is accepted from generated text.

Lifecycle: generated draft → parent edited/reviewed → approved or rejected. Activation invokes the normal authorised use case after explicit approval. Approval applies to the reviewed version; subsequent edits require renewed review. No autonomous learning-record writes.

Treat prompts, retrieved material and outputs as untrusted. Do not grant suggestion generation storage or write tools. Set request limits, cancellation, timeout and safe error handling. Do not log prompts containing learner narratives.

External transmission requires explicit informed permission for the actual data/provider; local execution does not imply permission to inspect unrelated files. Test malformed output, prompt injection, unsupported claims and complete AI-disabled core journeys.
