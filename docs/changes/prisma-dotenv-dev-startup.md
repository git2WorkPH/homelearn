# Prisma dotenv and API startup

Authorization: user requested fixing their Prisma error when running `pnpm dev` and explicitly asked to use dotenv.

Observed state: `dotenv` was added to the API dependencies in the existing working tree, but `apps/api/prisma7.config.ts` no longer imported it. The API server also parsed `DATABASE_URL` without loading dotenv. The root manifest had no `dev` script, only `dev:api`.

Change: add one dotenv loader used by both API startup and Prisma CLI configuration. It reads `apps/api/.env` first, then the repository-root `.env`, without overriding values already in the process environment. Add a root `pnpm dev` alias to the API development command and document the dotenv behavior.

Security: dotenv output is quiet; no environment file contents or credential values were displayed. The API still enforces loopback-only binding.

Verification: API typecheck and source/config review; do not run test suites unless requested. Database-backed startup verification is not performed unless explicitly authorized because it consumes the local database credential and connects to PostgreSQL.

Recovery: remove the root `dev` alias and loader import, then remove `apps/api/src/lib/load-environment.ts` if reverting the fix. Keep the user's existing dotenv dependency and lockfile changes unless separately asked to remove them.
