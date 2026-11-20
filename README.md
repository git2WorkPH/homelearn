# HomeLearn

Parent-led learning for iPhone and iPad. The current local prototype supports planning, activities, learning records, observations and explicit assessments with synthetic IDs. Authentication, family/learner setup, evidence and portfolios remain deferred.

## Local development

Use Node 22.13+ (validated with 26.1.0) and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then:

- `pnpm dev:api` — Fastify at http://127.0.0.1:3000/health.
- `pnpm dev:ios` — Expo development server and iOS simulator (Xcode required).
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm boundaries` — quality gates.
- `pnpm build` — TypeScript compilation and local iOS JavaScript/Hermes export. This does not create a signed native application.

For local PostgreSQL, set `HOMELEARN_DB_PASSWORD` and `DATABASE_URL` from `.env.sample` in your environment, then run `docker compose up -d postgres`. Port 5432 binds to loopback. The database volume persists; do not delete it as routine cleanup. The planning/learning schema migration is in `apps/api/prisma/migrations/0001_planning_learning` and can be applied with `pnpm --filter @homelearn/api db:migrate:deploy`. Run `pnpm --filter @homelearn/api test:postgres` for synthetic persistence coverage against the configured local database.

The API defaults to loopback; physical-device access and authentication need explicit configuration in later milestones. No cloud build, analytics integration or app-store deployment is configured.

## Structure

- `apps/mobile`: Expo/React Native planning and learning workflows with native interaction tests.
- `apps/api`: Fastify planning/learning API, Prisma/PostgreSQL repositories and API tests.
- `packages/contracts`: Zod transport contract and validation tests.
- `tooling`: dependency-boundary regression tests.
- `docs`: requirements, architecture, roadmap and change evidence.

Authentication remains deferred; Better Auth is recommended, not yet selected. API family ownership is not enforced yet, so keep the server on loopback and use synthetic records only. Native device E2E, VoiceOver and signing verification remain pending; component tests and bundle export do not substitute for those checks.
