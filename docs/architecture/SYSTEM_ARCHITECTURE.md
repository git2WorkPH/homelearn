# System architecture

Approved direction, 19 November 2026: React Native with Expo for iPhone/iPad and Prisma for PostgreSQL. Next.js/web and Android are deferred. This approval covers specification updates only. Native layouts must adapt to iPad resizing, portrait/landscape and iPhone widths. Offline synchronisation is a separate unapproved capability, not implied by a native client.

Prisma stays in backend infrastructure; generated persistence types must not become domain entities or public transport contracts. The mobile app accesses Fastify, never PostgreSQL directly. Preserve database-enforced foreign keys and family-scoped composite constraints; review generated migrations and use reviewed custom database operations where the selected Prisma version cannot express a required constraint.

Native sessions, secure token storage, deep links, photo permissions, file sharing, Apple signing and distribution require explicit designs. Select compatible Expo/React Native/Prisma versions and native testing tools before installation. No Expo cloud build or project upload is authorised by this document.

Status: Proposed design within the mandated baseline. See [ADR-001](../decisions/ADR-001-MODULAR-MONOLITH.md).

React Native with Expo for iPhone and iPad presents parent workflows. Fastify owns the API. PostgreSQL/Prisma implements persistence; Zod validates boundaries. Private S3-compatible storage holds evidence. Optional Ollama is behind a provider port. No AWS deployment is authorised.

Within each module: presentation → application → domain; infrastructure implements inward-facing ports. Composition roots wire adapters. Domain entities import no framework, persistence, filesystem or AI SDK. Mobile code calls API contracts rather than database repositories.

Proposed layout:

```text
apps/mobile/
apps/api/src/modules/<module>/{domain,application,infrastructure,presentation}/
apps/api/src/modules/<module>/index.ts
apps/api/src/composition/
packages/contracts/
packages/ui/
tests/{integration,e2e,security}/
tooling/
docs/
```

Modules expose deliberate application interfaces. Reporting reads authorised projections through public interfaces; it does not import private persistence. Keep shared contracts transport-specific and avoid a miscellaneous shared domain package.

Application use cases own transactions: family plus owner; activity plus assignments; record plus outcome links. Cross-module writes require explicit participating ports and a shared transaction boundary, not nested independent commits. Storage uses staged upload/finalisation and reconciliation because it cannot join a database transaction.

Propose pnpm workspaces, strict compiler settings, Oxlint, Vitest for backend/pure logic, separately selected native component/E2E tooling and an approved boundary checker. Exact versions and checker choice require compatibility research and approval before installation. Required future commands: lint, typecheck, test, build and boundary validation. No commands currently exist.
