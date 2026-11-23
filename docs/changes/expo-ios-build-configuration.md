# Expo iOS build configuration

Authorization: user asked to configure HomeLearn so they can build it with Expo.

Observed state: the iOS Expo app already exports locally, but has no EAS configuration, no iOS bundle identifier, and no linked Expo project ID. It is a pnpm monorepo app located at `apps/mobile`.

Change: add `apps/mobile/eas.json` with simulator preview, signed device preview and production profiles; add package scripts invoking the current EAS CLI without adding a persistent dependency; document setup and limitations. Follow Expo's monorepo rule by placing EAS configuration with the app.

Not performed: no Expo account linking, Apple credential access, bundle identifier selection, dependency installation, backend deployment, build submission, commit or push. EAS configuration must be completed interactively by the user, which will prompt for a unique bundle identifier and create/link an Expo project.

Security and product limits: current API is unauthenticated and loopback-only. A built app can review the sample-data prototype, but Local API workflows require a reachable HTTPS API and must not use real family data until authentication and authorization exist. `EXPO_PUBLIC_API_URL` is public client configuration, not a secret.

Follow-up documentation: README now explains that the laptop can run the local API/PostgreSQL for development, but physical iPhone/iPad LAN access is blocked by the API's loopback-only guard until authentication and family authorization are implemented. PostgreSQL remains loopback-only.

Verification: validate JSON/package metadata and run the existing local iOS export plus typecheck if useful. Do not run tests unless asked. EAS cloud build is not run as it requires the user's Expo account and project linking.

Recovery: remove the new EAS profile and scripts, and revert the new build guide/change record if the user chooses not to use EAS. No native source or dependency changes are required.
