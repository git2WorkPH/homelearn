# HomeLearn

Parent-led learning for iPhone and iPad. Foundation only: no accounts or educational data yet.

## Local development

Use Node 22.13+ (validated with 26.1.0) and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then:

- `pnpm dev:api` — Fastify at http://127.0.0.1:3000/health.
- `pnpm dev:ios` — Expo development server and iOS simulator (Xcode required).
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm boundaries` — quality gates.
- `pnpm build` — TypeScript compilation and local iOS JavaScript/Hermes export. This does not create a signed native application.

For local PostgreSQL, set `HOMELEARN_DB_PASSWORD` in your shell or a private `.env`, then run `docker compose up -d postgres`. Port 5432 binds to loopback. The database volume persists; do not delete it as routine cleanup. No migrations exist yet.

The API defaults to loopback; physical-device access and authentication need explicit configuration in later milestones. No cloud build, analytics integration or app-store deployment is configured.

## Structure

- `apps/mobile`: Expo/React Native shell and native component smoke test.
- `apps/api`: Fastify health service and API tests.
- `packages/contracts`: Zod transport contract and validation tests.
- `tooling`: dependency-boundary regression tests.
- `docs`: requirements, architecture, roadmap and change evidence.

Prisma and authentication arrive with HL-002's persistence design. Better Auth is recommended, not yet selected. Native device E2E, VoiceOver and signing verification remain pending; component tests and bundle export do not substitute for those checks.
