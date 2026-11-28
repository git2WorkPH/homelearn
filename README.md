# HomeLearn

Parent-led learning for iPhone and iPad. The in-memory HomeLearn sample remains fictional; the Local API workspace stores planning and learning records in the family database. Parent login and one-family authorization are implemented; family/learner management screens, evidence and portfolios remain pending.

## Local development

Use Node 22.13+ (validated with 26.1.0) and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then:

- `pnpm dev:api` — Fastify at http://127.0.0.1:3000/health.
- `pnpm dev:ios` — Expo development server and iOS simulator (Xcode required).
- `pnpm dev:ios:device` — locally build/install the development app on a connected iPhone/iPad using Xcode.
- `pnpm dev:ios:device:server` — start Metro for the installed development app over the local network.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm boundaries` — quality gates.
- `pnpm build` — TypeScript compilation and local iOS JavaScript/Hermes export. This does not create a signed native application.

For local PostgreSQL, copy `.env.sample` to `.env`, replace the local database password, then run `docker compose up -d postgres`. Port 5432 binds to loopback. The database volume persists; do not delete it as routine cleanup. Apply pending Prisma migrations with `pnpm --filter @homelearn/api db:migrate:deploy`. Run `pnpm --filter @homelearn/api test:postgres` for synthetic persistence coverage against the configured local database.

## Using your laptop as the development server

The laptop can run the local PostgreSQL database and HomeLearn API while you develop the iOS app. Start Postgres with the command above. In a terminal at the repository root, start the API:

```sh
pnpm dev
```

Dotenv loads `apps/api/.env` first and falls back to the repository-root `.env`; values already exported in the shell take precedence. In a second repository-root terminal, export the root `.env` values for Expo and start the iOS development server:

```sh
set -a
source .env
set +a
pnpm dev:ios
```

The API listens on `127.0.0.1:3000`; PostgreSQL listens on `127.0.0.1:5432`. Both are currently restricted to the laptop. The default `EXPO_PUBLIC_API_URL` in `.env.sample` points the app to the laptop's loopback API. The API and Prisma CLI load dotenv automatically; Expo needs the root `.env` values exported in its shell. Docker Compose reads the root `.env` file itself. Add a private random value for `BETTER_AUTH_SECRET` to `.env` (generate one with `openssl rand -base64 32`) and keep it out of source control.

To enable the API-backed planning and learning workspace, apply pending migrations and provision the parent account locally:

```sh
pnpm --filter @homelearn/api db:migrate:deploy
pnpm --filter @homelearn/api auth:provision
```

The provisioning command asks for the parent's email and name, then prompts for a password without displaying it. It creates the initial family membership for the existing `local-demo` family. There is no public sign-up screen or HTTP sign-up route. After provisioning, open **Local API** in HomeLearn and sign in. Better Auth stores sessions in PostgreSQL; the iOS app stores its session cookie in iOS secure storage.

EAS Build creates the iOS app binary in Expo's build service; it does not host the API or database. A simulator running on the same laptop can be used for local development with `pnpm dev:ios`. A cloud-built or installed app using the default loopback address will only look for the API on the device or simulator itself, not automatically discover the laptop.

**Physical iPhone/iPad access to the laptop API is not enabled yet.** Parent login and family authorization are implemented for the loopback API, but the API still rejects `0.0.0.0` and LAN addresses. Do not bypass this check or expose the API over Wi-Fi. Physical-device access needs a separately designed secure transport and explicitly configured LAN mode before changing `EXPO_PUBLIC_API_URL`. PostgreSQL should remain loopback-only.

When LAN support is implemented, the phone/tablet and laptop will need to be on a trusted network, the laptop must stay awake and reachable, and the app build must use the laptop's current reachable IP or local DNS name. Migration `0004_parent_auth_family_access` must be applied and the parent account provisioned before using real family data. See [Expo iOS build profiles](docs/planning/EXPO_IOS_BUILDS.md) for the separate EAS setup and build commands.

No cloud API, analytics integration or app-store submission is configured.

### Test on a physical iPhone/iPad without paid Apple membership

The EAS device and production profiles need paid Apple Developer signing. For personal testing, connect and unlock the iPhone/iPad, tap **Trust** if prompted, and use Xcode with your Apple ID's **Personal Team** for local signing. On iOS 16 and later, enable **Settings → Privacy & Security → Developer Mode**.

From the repository root, run:

```sh
pnpm dev:ios:device
```

The first run generates the native iOS project if needed, builds it locally and installs it on the selected device. Once installed, start the device-targeted Metro server with `pnpm dev:ios:device:server`, then open HomeLearn on the device. The phone and laptop must share a reachable local network. Xcode and its iOS platform support are required. Free Personal Team provisioning expires after seven days, so Xcode will need to re-provision the app periodically. This is a personal development install; EAS device distribution and App Store release still require a paid Apple Developer team.

The current local API remains loopback-only and cannot be reached from the physical device. The main sample experience remains available without sign-in; API-backed records require a parent session and family membership.

## Structure

- `apps/mobile`: Expo/React Native planning and learning workflows with native interaction tests.
- `apps/api`: Fastify planning/learning API, Prisma/PostgreSQL repositories and API tests.
- `packages/contracts`: Zod transport contract and validation tests.
- `tooling`: dependency-boundary regression tests.
- `docs`: requirements, architecture, roadmap and change evidence.

Parent email/password authentication and one-family authorization use Better Auth. Learner profile management, native device E2E, VoiceOver and signing verification remain pending; component tests and bundle export do not substitute for those checks.
