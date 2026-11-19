# Risks, assumptions and decisions

Approved stack direction (19 November 2026): React Native/Expo for iPhone and iPad; Prisma replaces Drizzle. Next.js and Android deferred. Exact versions, native UI/testing libraries, Apple distribution route, supported OS versions and offline requirements remain open. User approval authorises documentation changes only.

Prisma is suitable for the relational backend; no requirement currently justifies retaining Drizzle against the user's preference. Preserve SQL constraint/migration review and infrastructure boundaries. Official documentation is version-specific: verify the selected version before choosing commands or schema layout. Sources: [Prisma overview](https://www.prisma.io/docs/orm), [migration documentation](https://www.prisma.io/docs/orm/migrations/how-migrations-work).

Status: Open unless explicitly noted. Proposed defaults are not approved decisions.

| Item | Proposed direction / required decision |
|---|---|
| Package manager and versions | pnpm workspaces; verify compatible versions before requesting installation |
| Git | Current workspace now has master tracking origin/master; propose feature/homelearn-foundation only with approval |
| Authentication | Select maintained integration before HL-002 |
| Mode scope | Adult UI preference; confirm before persistence design |
| Membership roles | Start with owner; define any additional role before enabling it |
| Configuration | Field-wise inheritance, replacement collections and validated explicit clearing; confirm semantics |
| Catalog ownership | Decide global published reference/template schema versus family-owned custom content |
| Privacy | Approve minimum learner fields, retention, deletion, legal applicability and consent handling |
| Storage | Select S3-compatible local service, upload thresholds, scan strategy and preview metadata policy |
| Operations | Approve production host, encryption, backups and recovery targets separately |
| Reporting | Select PDF tooling, export limits and lifecycle; preserve provenance and avoid compliance claims |
| Content | Original starter material requires educational/provenance review |

## NSW source considerations

Initial official-source review on 19 November 2026 found that registration is administered by the NSW Department of Education while curriculum references remain tied to NESA syllabuses. Preserve both authority roles. See [registration guidance](https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register) and [teaching/learning responsibilities](https://www.nsw.gov.au/education-and-training/home-schooling/educational-programs/supervising-teaching-and-learning-experiences).

[Application information](https://www.nsw.gov.au/education-and-training/home-schooling/applying-to-register/submitting-an-application) references proposed policy changes. Reverify effective policy, syllabus transitions and reuse permissions before jurisdiction-specific implementation. This discovery is not a full regulatory verification or legal opinion. Do not hardcode registration rules from historical documents.

## Repository evidence

Initial discovery found only AGENTS.md and no Git repository. At documentation execution, Git existed on master tracking origin/master and README.md was untracked. Those changes were not made by this documentation task. No source, manifests, tests or package configuration were present.
