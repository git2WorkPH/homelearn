# Acceptance criteria

Execute UI journeys on supported iPhone and iPad devices/simulators, including resized iPad layouts, orientation changes, VoiceOver, Dynamic Type, photo permissions and native PDF sharing. Final supported versions and native test framework remain decisions. Browser automation does not verify native UI behaviour.

Status: Draft; all execution evidence NOT RUN. Synthetic fixtures only.

| ID | Scenario and expected result |
|---|---|
| AC-001 | Authenticated adult creates a family and two learners; unauthenticated access fails |
| AC-002 | Onboarding resumes after sign-out with saved steps intact |
| AC-003 | Switch modes both ways; goals, assignments, records, assessments and evidence remain identical |
| AC-004 | Configure different learner/subject methods; activity override wins, removal restores inheritance, invalid settings are rejected |
| AC-005 | Create custom and versioned official goals; existing records retain original references after a new version is added |
| AC-006 | Create weekly/shared activities, leave activities unscheduled and reschedule; history persists |
| AC-007 | Record spontaneous learning without a plan; shared learning supports independent learner observations |
| AC-008 | Complete an activity; no mastery judgement appears until an explicit assessment is recorded |
| AC-009 | Upload permitted evidence; original remains private, unsafe/oversized uploads fail and rejected objects cannot be served |
| AC-010 | Filter learner portfolio by date, subject and goal; only authorised records appear |
| AC-011 | Export PDF and evidence references; distinguish planned/completed/observed/demonstrated and show limited evidence without claiming failure or compliance |
| AC-012 | Browse/search/filter the versioned shared catalogue by Kindergarten/Years 1–12 and learning area; show coverage gaps; link a selected catalogue lesson to a planned activity and resulting learning record while preserving its exact pack/version reference. Current starter scope is two original Bible-inspired drafts per level for Kindergarten–Year 3 across seven areas; each includes a passage reference, original child-friendly paraphrase and reflection prompt, with no translation quotation, and remains marked “needs parent review.” Missing levels/areas remain visible and no official mapping or mastery is implied. Full K–12 reviewed content, editorial tools and NSW syllabus references remain outstanding |
| AC-013 | Substitute another family's IDs across reads, writes, links, uploads, downloads and exports; access fails without leaking content |
| AC-014 | Malformed inputs fail safely and logs contain no secrets or child narratives |
| AC-015 | Complete the core parent journey with AI disabled |
| AC-016 | With P1 enabled, local Ollama output is schema-validated, labelled as AI-generated and remains an unsaved draft until parent approval; invalid output is rejected and generation cannot autonomously alter records |
| AC-017 | Complete primary workflows by keyboard and assess proposed accessibility target manually and automatically |
| AC-018 | Migration/restore exercises preserve authorised records and object references under the approved recovery policy |
| AC-019 | From Lessons, open the HEA free-resources directory in HomeLearn; open linked HTTPS resources in the same view; Back follows browser history and returns to Lessons at the root; failed pages offer retry and Safari fallback; non-HTTPS navigation is blocked |

Future evidence must record command/scenario, revision, environment, result and limitations. Test existence is not proof of acceptance.
