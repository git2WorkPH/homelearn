# Expo iOS builds

HomeLearn's Expo app lives in `apps/mobile`. EAS Build configuration is kept in that app directory because this repository is a pnpm monorepo. Run EAS CLI commands from `apps/mobile`.

## Profiles

| Profile | Artifact | Signing/account needs |
|---|---|---|
| `preview-simulator` | iOS Simulator build for local review | Expo account; no Apple signing credentials |
| `preview-device` | Internally distributed iPhone/iPad build | Expo account, Apple Developer signing, and registered devices for ad hoc installation |
| `production` | App Store Connect-ready iOS build | Expo account and Apple Developer Program signing; building does not submit the app |

The repository includes scripts for each profile. For example:

```sh
cd apps/mobile
npx eas-cli@latest login
npx eas-cli@latest build:configure --platform ios
pnpm build:eas:simulator
```

During EAS project configuration, sign in to the Expo account that should own HomeLearn. EAS will prompt for a unique iOS bundle identifier because `app.json` does not yet contain one, and it will link the app to an Expo project by adding its project ID. Review those generated changes before committing them. Do not provide Apple credentials to Codex; enter them only in the EAS CLI prompts if you choose to build a signed device or store artifact.

For a signed device preview, use `pnpm build:eas:device`. For a store-ready artifact, use `pnpm build:eas:production`. Neither command submits the build to Apple; store submission is a separate step and is not configured here.

## Backend and environment limitations

EAS Build creates an iOS application binary. It does not deploy HomeLearn's Fastify API or PostgreSQL database. The current API is unauthenticated and intended for loopback-only development. The app's default API URL (`http://127.0.0.1:3000`) refers to the device or simulator itself, so the Local API workflow will not reach a development machine or remote database from an installed build.

The default sample-data prototype can be used to review the mobile experience. Do not point a preview or production build at real family data until authentication, family authorization and a secure hosted API are implemented. Once a suitable backend exists, set `EXPO_PUBLIC_API_URL` in the EAS `preview` and `production` environments to its HTTPS base URL. This value is compiled into the app and is public; never put credentials or secrets in an `EXPO_PUBLIC_` variable.

## Remaining setup

- An Expo account must initialize/link the remote project and generate `extra.eas.projectId` in `app.json`.
- Choose a unique iOS bundle identifier during the EAS configuration prompt.
- Apple Developer signing is needed for builds installed on physical iOS devices and for App Store distribution.
- A hosted, authenticated API is needed for Local API workflows in deployed builds.

EAS profiles follow [Expo's `eas.json` build-profile guidance](https://docs.expo.dev/build/eas-json/), and the app-directory placement follows [Expo's monorepo guidance](https://docs.expo.dev/build-reference/build-with-monorepos/).
