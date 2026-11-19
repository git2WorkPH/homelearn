# HL-003B — Versioned curriculum goals

Authorised by the user's instruction “next” in the established sequence after HL-003A. Implement pure curriculum domain behaviour and focused tests. No API, database, authentication, UI or third-party syllabus content.

Goals retain immutable version identity and provenance: publisher/source, curriculum identifier, version label, effective interval and retrieval timestamp. Family goals remain distinct from official references. Revisions create new versions; goal references continue pointing to the earlier version. Validate dates, identifiers and links at the domain boundary. Synthetic content only.

## Scope status — 20 November 2026

Pure curriculum goal/version domain and routes have been implemented locally. The routes currently use an in-memory adapter. Prisma 7.10.1 schema validates and client generation succeeds, but no Prisma repository or SQL migration has been completed/applied. Treat persistence as deferred and do not use these routes for durable family data. Test coverage includes API validation, duplicate handling, version retrieval/listing and pure goal/version rules.
