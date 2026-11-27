# HEA free-resource browser

Authorisation: on 27 November 2026, the user selected the in-app browser approach for the Home Education Association (HEA) free-resources directory after reviewing the recommendation. Scope: add the directory to the HomeLearn Lessons screen, display HEA and linked HTTPS pages in a full-screen WebView, provide page-history/back-to-Lessons navigation, and offer Safari as a fallback when a page fails to display. Adding the Expo-compatible `react-native-webview` dependency is included in this approval.

Requirements: FR-010 and AC-019.

Source directory: [Home Education Association free resources](https://www.hea.edu.au/free).

Current evidence: the Lessons screen contains a dedicated HEA resource entry. The WebView permits HTTPS navigation only, disables mixed content, handles new-window resource links in the current view, tracks page history, and displays retry/Safari actions on load errors. The dependency is `react-native-webview@14.0.1`, recommended by Expo SDK 58 documentation. No HEA or third-party content is copied into HomeLearn.

Impact: mobile UI and dependency/lockfile only; no API, database, learner data, authentication or migration changes. Pages are third-party content and may not all support embedded browsing. The Safari fallback uses the current HTTPS page. No learner information is passed to the resource site by HomeLearn.

Verification: `pnpm --filter @homelearn/mobile typecheck`, targeted Oxlint, `pnpm --filter @homelearn/mobile build` (iOS Expo export), `pod install` (native module autolinking) and `git diff --check` pass. CocoaPods logged a non-blocking warning that Expo `CoreModule` is internal. No tests were added or run. Physical-device website rendering, page navigation and Safari fallback remain unverified.

Recovery: revert only the resource screen, Lessons entry, resource-screen state, dependency/lockfile changes and this requirement/change documentation. No existing files or behavior were removed.

Status: implemented and statically verified; native runtime behavior still needs iPhone/iPad review.
