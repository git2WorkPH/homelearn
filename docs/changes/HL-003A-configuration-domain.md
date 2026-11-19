# HL-003A — Learning configuration domain

Authorised 20 November 2026: user approved committing/pushing HL-001 and continuing with pure configuration domain logic and tests, moving authentication later. Scope: four independent dimensions, precedence, clearing/inheritance, per-learner resolution, validation and detached snapshots. No API, accounts, database, UI or new dependencies.

Semantics: each dimension is a list of opaque definition references. Absent dimension inherits; [] clears; a present list replaces. IDs must be nonempty, unique and registered for that dimension in the supplied catalog. Catalog conflict pairs describe incompatible selections without embedding educational philosophies. Validate every explicit layer even when overridden; validate conflicts on the final effective configuration. Missing family values resolve to empty selections with default provenance. Returned values and provenance are detached and frozen. Persisting snapshots remains future records work.

ADD tests for four-layer precedence, removing overrides, clearing versus inheritance, malformed inputs, unknown/duplicate references, configurable conflicts, independent learners and snapshots unaffected by subsequent input mutation. KEEP foundation tests. No removals or migrations.

Requirements: configuration portion of FR-002, AC-004; historical snapshot support for NFR-006 (persistence not implemented). Status: implementation and verification in progress.

## Review and verification

Added apps/api/src/modules/learning-configuration/{domain/learning-configuration.ts,index.ts}, external module tests and a test-inclusive API typecheck configuration. Updated roadmap/backlog, domain model and traceability. No new dependencies or persistence changes. Review checked layer separation, error metadata without supplied values, detached frozen snapshots and absence of authentication/API exposure.

PASS: pnpm lint; pnpm typecheck; pnpm test (17 API/domain tests, one contract test, one native component test, two architecture tests); pnpm boundaries; pnpm --filter @homelearn/api build. Full mobile build not repeated because mobile code/dependencies are unchanged. No database, UI/E2E or persisted-history claim.

Foundation pushed to origin/master at 8b5cd45. This configuration increment remains uncommitted for review. Authentication remains deferred, not removed from MVP. Next candidate work is versioned curriculum goals/domain, or configuration UI using synthetic data, subject to a separately agreed scope.
