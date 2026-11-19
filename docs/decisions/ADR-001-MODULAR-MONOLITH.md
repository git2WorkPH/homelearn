# ADR-001 — Modular monolith with Clean Architecture

Date: 19 November 2026 (Australia/Sydney)

Status: Proposed implementation design. The modular-monolith/Clean Architecture baseline is mandated by AGENTS.md; this ADR does not claim approval of detailed implementation choices.

Context: HomeLearn needs cohesive family, planning, evidence and reporting workflows, strong ownership boundaries and manageable local operation.

Decision proposal: implement a Fastify modular monolith with domain/application/infrastructure/presentation layers and public module interfaces, alongside a React Native/Expo iOS frontend. Application use cases own transactions and composition roots wire adapters.

Alternatives considered: microservices increase deployment and consistency work without current need; an undifferentiated application makes ownership and test isolation harder. Neither is proposed.

Consequences: simpler deployment and database transactions, but boundaries require automated checks and review. Shared database access must not become permission to import another module's persistence internals. Avoid boilerplate ports for trivial pure operations.

Acceptance evidence: boundary checker, no circular dependencies, framework-free domain tests and scoped cross-module transaction tests. All are currently NOT RUN.
