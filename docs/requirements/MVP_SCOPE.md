# MVP scope

Platform decision: native iPhone/iPad client using React Native with Expo; web/Next.js and Android deferred. Backend remains Fastify/PostgreSQL, with Prisma as ORM. Offline creation and synchronisation are not yet approved requirements.

Status: Draft baseline derived from the user's requirements. No application implementation is approved.

P0 includes FR-001 through FR-008: adult/family access, learners, resumable onboarding, both modes, configuration inheritance, curriculum goals, planning, scheduled and spontaneous records, private portfolios, PDF reporting and a reviewed Kindergarten–Year 12 lesson catalogue across its defined subject/strand scope. The catalogue design is specified in [LESSON_CATALOGUE_PLAN.md](LESSON_CATALOGUE_PLAN.md); the prototype's small illustrative library is not complete content or persisted catalogue functionality. Reviewed pack delivery and explicit level/strand coverage are release acceptance requirements. NSW syllabus mapping is deferred to a separately approved and sourced task.

P1 is FR-009, optional AI assistance. All P0 acceptance criteria must remain achievable with AI disabled.

Excluded: child logins, tutor/group/publisher features, marketplace, billing, public child profiles, microservices, autonomous AI changes and AWS deployment. Future jurisdiction support means extensible references, not implementation of other jurisdictions now. The lesson catalogue does not certify compliance; jurisdiction-specific syllabus mappings must be separately verified and sourced.

Completion requires the [acceptance criteria](ACCEPTANCE_CRITERIA.md), required quality gates, accessibility assessment, documentation and no unresolved critical security vulnerabilities. Milestone priority controls sequence rather than removing MVP requirements.
