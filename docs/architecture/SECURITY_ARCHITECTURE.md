# Security and privacy architecture

Status: Parent session checks, family membership resolution, family-scoped API reads/writes and private mobile cookie storage are implemented locally but have not been security-tested or verified against a migrated database. LAN access remains disabled.

| Threat | Planned control | Evidence required |
|---|---|---|
| Cross-family access/IDOR | Server-resolved membership, scoped repositories, family-consistent foreign keys | Two-family read/write/link regressions (NOT RUN) |
| Unauthorised changes | Better Auth persistent sessions, disabled public sign-up, server actor attribution, sign-in rate limit | Session and permission tests (NOT RUN) |
| Unsafe uploads | Size/type checks, quarantine, malware strategy, private originals | Rejected-content and access tests |
| File/report leaks | Authorised retrieval, short-lived links, private exports, cache policy | Unauthorised and expired-link scenarios |
| Sensitive logging | Structured metadata only, redaction, no narrative bodies | Log inspection and tests |
| Prompt injection/exfiltration | Untrusted suggestions, no tools with record-write authority, explicit transmission consent | Adversarial provider-output tests |

Better Auth provides password hashing and session handling; the API uses its Expo plugin and the iOS app stores cookies in SecureStore. HTTP sign-up is disabled. The initial account is created through an interactive local-only provisioning script. Server cookies use secure transport flags in production; development is restricted to the laptop loopback API. Better Auth's in-memory rate limiter allows at most five email sign-in attempts per minute per client IP. PostgreSQL row-level security remains unimplemented and is not a substitute for application authorisation.

Use synthetic fixtures. Minimise learner fields and avoid requiring exact birth dates or diagnoses. Preserve uploaded originals privately; derive safe previews and decide metadata handling explicitly. No public learner profiles. Define transport and at-rest encryption for the selected deployment, secrets outside source, backup access and restore testing.

Before production approve retention/deletion (including backups), export, incident response, recovery objectives and audit policy. Australian Privacy Act/APP applicability, breach notification, overseas processing and relevant NSW obligations require authoritative research and legal review for the actual operator. This document makes no determination of legal applicability.

External AI receives no identifiable learner information without explicit parental permission. Local AI also requires safe input/output handling. See [AI integration](AI_INTEGRATION.md).
