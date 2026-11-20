# Planning and learning visual prototype

Authorization: user asked for an interactive prototype to review the intended HomeLearn product experience. This work is limited to the iOS presentation; existing API and persistence behavior remains available from the prototype's “Local API” entry.

Rationale: the API-connected form screen demonstrated operations but not how a finished parent-facing product could feel. A sample-data prototype makes the weekly rhythm, learner context, journal and progress views reviewable before further product decisions.

Changes: add Home, Planner, Journal and Progress prototype views; sample learners and learning records; Guided/Independent mode switching; local activity completion toggles; activity and learning-moment sheets; learner filtering; responsive iPhone/iPad layout. Sample state lives only in the current screen session and does not contact the API. No packages, schema, migration or backend behavior changed.

Privacy: all names and records are fictional sample data. No account, family authorization or real learner data is used. The API-connected development flow remains loopback-only and is still unsuitable for network exposure.

Verification: Oxlint, mobile TypeScript check, mobile Jest tests and iOS Expo export passed. Native simulator interaction and VoiceOver were not run.
