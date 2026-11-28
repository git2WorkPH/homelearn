# Non-functional requirements

Status: Proposed measurable requirements. NFR-001/002/009 have partial implementation; no security acceptance criteria have been verified in this change.

| ID | Requirement | Verification |
|---|---|---|
| NFR-001 | Enforce family ownership for reads, writes, files and exports | Family-scoped API reads/writes implemented; files/exports not implemented; cross-family regression scenarios NOT RUN |
| NFR-002 | No secrets or educational narratives in application logs | Auth headers/cookies redacted and request logging disabled; log review/tests NOT RUN |
| NFR-003 | Strict TypeScript, inward dependencies, public module interfaces, no cycles | Compiler, Oxlint and approved boundary checker |
| NFR-004 | Proposed WCAG 2.2 AA target; responsive parent workflows | Automated checks plus keyboard, focus, VoiceOver, Dynamic Type and contrast review |
| NFR-005 | Core workflows operate with AI disabled | Complete end-to-end journey with no provider configured |
| NFR-006 | Preserve history, curriculum provenance and independent assessments | Domain and database integration tests |
| NFR-007 | Bounded uploads, pagination, export limits and safe errors | Boundary and failure tests; thresholds pending decision |
| NFR-008 | Reproducible migrations and recoverable backups | Disposable-database migration and approved restore exercise |
| NFR-009 | Secure sessions, private storage and protected transport | Better Auth sessions and iOS SecureStore implemented; private storage and LAN transport not implemented; deployment review pending |

Performance budgets, supported iOS/iPadOS versions and devices, backup recovery objectives, retention periods and production encryption configuration remain decisions, not claims of compliance. Pin compatible dependencies after approval; record upgrades and migration effects. See [risks](../planning/RISKS_AND_ASSUMPTIONS.md).
