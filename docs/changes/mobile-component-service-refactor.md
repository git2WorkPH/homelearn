# Mobile component and service separation

Source and authorization: user request to make the mobile app easier to read by separating app components and services; followed after the user requested pushing the existing unrelated EAS/dotenv changes to `master`.
Status: implemented locally; typecheck and lint passed; existing tests not run.

## Problem and evidence

`apps/mobile/src/app.tsx` combined root navigation, a large local API workflow, transport types, HTTP utilities, API endpoint calls and catalogue screens. The app root and API integration were difficult to locate and review independently.

## Change and alternatives

Move the local API workflow into its own feature component and extract API transport types and HTTP helpers into a service module. Keep the root app as the composition point for the prototype and local API workflow. This preserves current screens, routes, payloads and interactions while giving future component extraction a clear feature boundary. No dependency or backend contract change is intended.

## Impact

- `apps/mobile/src/app.tsx`: root composition only.
- `apps/mobile/src/features/local-api/LocalApiWorkflow.tsx`: existing local API workflow and catalogue UI.
- `apps/mobile/src/services/homelearn-api.ts`: API DTO types, request helper, synthetic identifiers, time helper and assessment loading.
- `apps/mobile/src/features/prototype/`: prototype fixture data, reusable/tab components and styles.
- `apps/mobile/src/prototype.tsx`: prototype state orchestration and modal coordination.

## Test decisions

| Test/scenario | Decision | Rationale |
|---|---|---|
| Existing mobile workflow test suite | KEEP | Existing behavior and assertions remain unchanged. |
| Add or remove tests | None | This is a structural refactor; existing integration coverage is preserved. |

## Removal inventory and approval

No user-facing behavior or API was removed. Code moved out of `app.tsx` to the feature and service modules at the user's request; the original content is retained in those modules.

## Verification and recovery

- `pnpm --filter @homelearn/mobile typecheck` — passed.
- `pnpm lint` — passed.
- `git diff --check` — passed.
- Mobile tests and build — not run; tests were not requested and no app binary was requested.

Recovery is a follow-up move of the feature/service code back into `app.tsx`; no data or schema changes are involved.
