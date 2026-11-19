# Non-functional requirements

Status: Proposed measurable requirements; implementation NOT_STARTED.

| ID | Requirement | Verification |
|---|---|---|
| NFR-001 | Enforce family ownership for reads, writes, files and exports | Cross-family API, repository and storage regression scenarios |
| NFR-002 | No secrets or educational narratives in application logs | Redaction tests and representative log inspection |
| NFR-003 | Strict TypeScript, inward dependencies, public module interfaces, no cycles | Compiler, Oxlint and approved boundary checker |
| NFR-004 | Proposed WCAG 2.2 AA target; responsive parent workflows | Automated checks plus keyboard, focus, VoiceOver, Dynamic Type and contrast review |
| NFR-005 | Core workflows operate with AI disabled | Complete end-to-end journey with no provider configured |
| NFR-006 | Preserve history, curriculum provenance and independent assessments | Domain and database integration tests |
| NFR-007 | Bounded uploads, pagination, export limits and safe errors | Boundary and failure tests; thresholds pending decision |
| NFR-008 | Reproducible migrations and recoverable backups | Disposable-database migration and approved restore exercise |
| NFR-009 | Secure sessions, private storage and protected transport | Security review and deployment-specific checks |

Performance budgets, supported iOS/iPadOS versions and devices, backup recovery objectives, retention periods and production encryption configuration remain decisions, not claims of compliance. Pin compatible dependencies after approval; record upgrades and migration effects. See [risks](../planning/RISKS_AND_ASSUMPTIONS.md).
