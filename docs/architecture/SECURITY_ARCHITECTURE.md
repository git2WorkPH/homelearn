# Security and privacy architecture

Status: Proposed controls; no security properties have been implemented or verified.

| Threat | Planned control | Evidence required |
|---|---|---|
| Cross-family access/IDOR | Membership checks, scoped repositories, composite foreign keys | Two-family read/write/link regressions |
| Unauthorised changes | Secure sessions, role policy, revision checks, minimal audit trail | Session and permission tests |
| Unsafe uploads | Size/type checks, quarantine, malware strategy, private originals | Rejected-content and access tests |
| File/report leaks | Authorised retrieval, short-lived links, private exports, cache policy | Unauthorised and expired-link scenarios |
| Sensitive logging | Structured metadata only, redaction, no narrative bodies | Log inspection and tests |
| Prompt injection/exfiltration | Untrusted suggestions, no tools with record-write authority, explicit transmission consent | Adversarial provider-output tests |

Choose a maintained authentication integration; do not invent password/session cryptography. Specify cookie security, CSRF protection where applicable, session expiry/revocation and abuse limits before implementation. PostgreSQL row-level security remains an option requiring pool/transaction tests, not a substitute for application authorisation.

Use synthetic fixtures. Minimise learner fields and avoid requiring exact birth dates or diagnoses. Preserve uploaded originals privately; derive safe previews and decide metadata handling explicitly. No public learner profiles. Define transport and at-rest encryption for the selected deployment, secrets outside source, backup access and restore testing.

Before production approve retention/deletion (including backups), export, incident response, recovery objectives and audit policy. Australian Privacy Act/APP applicability, breach notification, overseas processing and relevant NSW obligations require authoritative research and legal review for the actual operator. This document makes no determination of legal applicability.

External AI receives no identifiable learner information without explicit parental permission. Local AI also requires safe input/output handling. See [AI integration](AI_INTEGRATION.md).
