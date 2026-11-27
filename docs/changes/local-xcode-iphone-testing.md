# Local Xcode iPhone testing

Source and authorization: user asked to prepare HomeLearn for physical-device testing after the EAS device profile failed because their Apple account has no paid Developer team.
Status: setup implemented locally; mobile typecheck, targeted lint and Expo config validation passed. Physical installation remains pending.

## Problem and evidence

`apps/mobile` was an Expo SDK 58 project with simulator and paid-team EAS device profiles, but did not include `expo-dev-client` or a local Xcode device command. The user wants to test on their physical iPhone without a paid Apple Developer team. Existing setup errors also showed Expo CLI 58.1.21 and Xcode 26.6 on the available Mac.

## Change and alternatives

Install the SDK-compatible `expo-dev-client` (`~58.0.21` selected by Expo's local SDK 58 compatibility map), add commands for local Xcode device install and LAN Metro, and document personal signing prerequisites and limits. Keep EAS device and production profiles unchanged. Local personal signing is suitable for development on the user's own connected device; EAS distribution and App Store signing remain separate and require paid membership.

## Impact

- `apps/mobile/package.json`, `pnpm-lock.yaml`: add the Expo SDK-matched dev client.
- Root and mobile scripts: local Xcode device build/install and LAN dev server commands.
- Root `.gitignore`: keep generated native iOS project output local; Expo regenerates it, and Xcode may write developer-specific signing settings into it.
- `README.md`, `docs/planning/EXPO_IOS_BUILDS.md`: setup steps and accurate local-vs-EAS signing guidance.
- No backend, database, API, or existing user edits changed.

## Test decisions

| Test/scenario | Decision | Rationale |
|---|---|---|
| Existing tests | KEEP, NOT RUN | No behavior changed; test execution was not requested. |
| Typecheck and lint | RUN | Verify dependency and script changes do not break project configuration. |
| Physical Xcode install | NOT RUN | Requires the user's iPhone to be connected, trusted and selected in Xcode. |

## Removal inventory and approval

None. Existing EAS simulator/device/production profiles and scripts remain available.

## Verification and recovery

Verification:

- `pnpm add expo-dev-client@~58.0.21 --store-dir /Users/cervantes/Library/pnpm/store/v11` — passed; package and lockfile updated.
- `pnpm --filter @homelearn/mobile typecheck` — passed.
- `pnpm exec oxlint src/app.tsx src/prototype.tsx src/features/prototype src/services/homelearn-api.ts` from `apps/mobile` — passed.
- `pnpm --filter @homelearn/mobile exec expo config --type public` — passed; resolved SDK 58, configured bundle identifier and linked EAS project.
- `pnpm lint` — blocked by trailing whitespace in two pre-existing uncommitted files: an API repository file and `LocalApiWorkflow.tsx`; those lines were left untouched.
- Physical Xcode build/install and automated tests — not run. The phone must be connected and selected by the user; tests were not requested.

To recover, remove only the new local-device scripts and dev-client dependency and revert this documentation; retain all existing EAS setup.
