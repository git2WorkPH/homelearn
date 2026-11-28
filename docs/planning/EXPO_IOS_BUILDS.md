# Expo iOS builds

HomeLearn's Expo app lives in `apps/mobile`. EAS Build configuration is kept in that app directory because this repository is a pnpm monorepo. Run EAS CLI commands from `apps/mobile`.

## Profiles

| Profile | Artifact | Signing/account needs |
|---|---|---|
| `preview-simulator` | iOS Simulator build for local review | Expo account; no Apple signing credentials |
| `preview-device` | Internally distributed iPhone/iPad build | Expo account, Apple Developer signing, and registered devices for ad hoc installation |
| `production` | App Store Connect-ready iOS build | Expo account and Apple Developer Program signing; building does not submit the app |

The EAS project is already linked in `apps/mobile/app.json`, which also contains the iOS bundle identifier. Sign in to the Expo account that owns this project and run the selected build script from `apps/mobile`:

```sh
cd apps/mobile
npx eas-cli@latest login
pnpm build:eas:simulator
```

Do not provide Apple credentials to Codex; enter them only in the EAS CLI prompts if you choose to build a signed device or store artifact.

For a signed device preview, use `pnpm build:eas:device`. For a store-ready artifact, use `pnpm build:eas:production`. Neither command submits the build to Apple; store submission is a separate step and is not configured here.

## Local physical-device development

For personal iPhone/iPad testing without paid Apple Developer membership, use Xcode's local development signing instead of the EAS device profile. The repository includes `expo-dev-client` and these commands:

```sh
# From the repository root; connect and unlock the device first.
pnpm dev:ios:device

# After the app is installed, start the LAN development server when needed.
pnpm dev:ios:device:server
```

Sign in to Xcode with an Apple ID and choose its **Personal Team** for automatic signing. Enable Developer Mode on iOS 16 and later. Xcode, iOS platform support, a trusted USB connection for initial setup and a network connection between device and laptop are required. Personal Team provisioning expires after seven days, so Xcode must re-provision periodically. Local personal signing is for development on your own device; EAS device distribution and App Store builds still require paid Apple Developer membership. Expo documents local Xcode builds as the iPhone development-build option that does not require paid membership: [local development builds](https://docs.expo.dev/develop/development-builds/introduction/). Apple confirms that Personal Team device profiles expire after seven days: [Apple Developer account overview](https://developer.apple.com/help/account/basics/about-your-developer-account).

## Backend and environment limitations

EAS Build creates an iOS application binary. It does not deploy HomeLearn's Fastify API or PostgreSQL database. Parent authentication and family scoping are implemented, but the API remains loopback-only. The app's default API URL (`http://127.0.0.1:3000`) refers to the device or simulator itself, so the Local API workflow will not reach a development machine or remote database from an installed build.

The default fictional sample-data experience can be used to review the mobile experience. The local API remains loopback-only and cannot be reached from a physical iPhone/iPad. Migration `0004_parent_auth_family_access` must be applied and the parent account provisioned before the authenticated Local API workflow can use the database. Do not point a preview or production build at family data until a secure hosted API is designed and configured. Once a suitable backend exists, set `EXPO_PUBLIC_API_URL` in the EAS `preview` and `production` environments to its HTTPS base URL. This value is compiled into the app and is public; never put credentials or secrets in an `EXPO_PUBLIC_` variable.

## Remaining setup

- Paid Apple Developer signing is needed for EAS device builds and App Store distribution; local Xcode personal development signing can be used on your own device without paid membership.
- A hosted API with secure transport is needed for Local API workflows on physical devices or deployed builds.

EAS profiles follow [Expo's `eas.json` build-profile guidance](https://docs.expo.dev/build/eas-json/), and the app-directory placement follows [Expo's monorepo guidance](https://docs.expo.dev/build-reference/build-with-monorepos/).
