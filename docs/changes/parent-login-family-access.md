# Parent login and family access

Authorisation: the user approved implementing basic parent login with no public sign-up, Better Auth dependencies, family membership and server-side family authorization, mobile secure session storage, and preparation of an additive Prisma migration. The user reported that a migration is applied; the repository currently contains only migrations `0001`–`0003`, so this change prepares a new auth/family migration and does not connect to or modify the database. No branch change, commit, push, or LAN exposure is authorized.

Requirements: FR-001, AC-001, AC-013, AC-014. Scope is parent email/password login and logout, one locally provisioned parent account, one family context, and authorization of family-owned planning, learning, lesson, and curriculum API requests. Public sign-up is disabled. Account provisioning is a local-only command and does not expose a sign-up HTTP route.

Rationale: the planning API previously trusted client-provided family IDs and had no authenticated actor. Login without deriving and enforcing the server-side family context would still permit IDOR and cross-family access. Better Auth provides supported Fastify, Prisma 7, Expo and SecureStore integrations; Expo's current guide supports Expo SDK 53+ Metro package exports.

Data impact: add Better Auth user/session/account/verification tables, Family and FamilyMember, and family foreign keys for existing family-owned rows. The migration preserves existing data, creates placeholder family rows for existing family IDs, and quarantines older custom curriculum versions under `legacy-unassigned` until an owner assigns them. It does not create credentials or attach a user. Run `pnpm --filter @homelearn/api auth:provision` locally after applying the migration.

Security constraints: authentication routes permit sign-in/sign-out/session only; public sign-up stays disabled. Family-owned API routes require an active Better Auth session and exactly one family membership; the server derives familyId from that membership. The K–12 source-controlled catalogue and health route remain public because they contain no family records. API binding remains loopback-only. No password, cookie, session token, database URL, or child narrative is logged or included in fixtures.

Verification: Oxlint, API/mobile TypeScript checks, Prisma Client generation, Prisma schema validation, and the full contracts/API/iOS bundle build pass. `git diff --check` is clean. Automated tests were not added or run. Migration execution, real-account provisioning, physical-device login, LAN access, TLS, native E2E and Apple signing remain unperformed.

Recovery: migration is additive and not applied by this change. Do not edit applied migrations or drop existing user data. Preserve all unrelated files and existing history.
