# HL-001 — Workspace foundation

Status: In progress. Authorisation: user requested pushing existing specifications and starting the first proposed implementation task on 19 November 2026. Scope includes local workspace dependencies and quality tooling necessary for HL-001; no production infrastructure or authentication implementation.

Documentation baseline pushed as 21ccb44 to origin/master. Continue on current master without a branch change. Implementation remains uncommitted pending review; the push request covered existing documentation changes.

Add pnpm workspace, strict TypeScript, Expo iOS shell, Fastify health endpoint, contract validation, Oxlint, backend and native tests, dependency-boundary validation and local PostgreSQL Compose definition. No domain schemas or migrations yet. Preserve modular architecture without scaffolding empty business modules.

Dependencies: Expo and its compatible React/React Native versions, Fastify, Zod, TypeScript, Oxlint, Vitest, tsx, dependency-cruiser and compatible native test tools. Pin exact direct versions and lock transitive dependencies. Prisma generation begins with the first real persistence schema in HL-002.

Test classifications: ADD health response/unknown-route tests, native shell accessibility smoke test and architecture violation fixtures. Verification pending. Recovery must preserve existing files and any local database volume; no destructive reset is authorised.

Authentication recommendation: Better Auth with Expo integration, subject to user decision for HL-002. Keep adult authentication separate from family authorisation and child records. Source: https://better-auth.com/docs/integrations/expo . No auth provider installed or configured in this task.

## Validation — 20 November 2026 (Australia/Sydney)

PASS: pnpm install; pnpm lint; pnpm typecheck; pnpm test (API, contract, native component and two architecture tests); pnpm build (contracts/API compilation and Expo iOS Hermes bundle export). Compose configuration validated with a synthetic placeholder password; no database service or migration executed.

The architecture regression exposed warning-only severity; changed rules to errors and confirmed the forbidden fixture fails. Added explicit Jest types to the mobile compiler configuration. Reviewed and allowed esbuild and Parcel watcher install scripts locally in pnpm-workspace.yaml. No global settings changed.

Limitations: iOS binary compilation/signing, real-device/VoiceOver/E2E checks and live PostgreSQL are NOT RUN. Mobile build means bundle export, not a signed app. Native E2E framework remains open. Authentication and Prisma schema are intentionally HL-002 work. Better Auth's current Prisma adapter documents Prisma 7 support and excludes Prisma 8; verify/pin a supported pair before HL-002 (https://better-auth.com/docs/adapters/prisma).

Implementation files remain uncommitted on master; documentation commit 21ccb44 was pushed. Next action: review foundation and select authentication before HL-002. No product functional requirement is claimed complete by this foundation.

20 November 2026 handover update: foundation committed and pushed to origin/master as 8b5cd45 following explicit user instruction. The user then approved HL-003A configuration domain before authentication; earlier next-action notes are superseded by that scoped sequence decision.

20 November 2026 final revalidation: after generated Prisma client was created, dependency-cruiser excluded generated code to avoid scanning generated internal cycles. PASS: pnpm lint, pnpm typecheck, pnpm test (27 API tests, one contract test, one native test, two boundary tests), pnpm boundaries, pnpm build including iOS bundle export. Prisma schema validate and client generation passed. No database migration or live integration test; PostgreSQL was not started because no local DB credential was configured. Curriculum routes use an in-memory repository, so persistence is not implemented.
