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
| AC-012 | Browse by Kindergarten/Years 1–12, learning area, strand and search. Preview level-appropriate learning intent, materials, steps, adaptations, estimated time and provenance. Review workflow records status, reviewer and date; coverage is tracked per level/strand with gaps visible. “Available” is distinct from “Complete to defined scope”. Parent adaptations do not change shared versions or imply mastery. NSW syllabus references are out of scope until separately verified |
| AC-013 | Substitute another family's IDs across reads, writes, links, uploads, downloads and exports; access fails without leaking content |
| AC-014 | Malformed inputs fail safely and logs contain no secrets or child narratives |
| AC-015 | Complete the core parent journey with AI disabled |
| AC-016 | With P1 enabled, invalid AI output is rejected; valid suggestions remain drafts until approved and cannot autonomously alter records |
| AC-017 | Complete primary workflows by keyboard and assess proposed accessibility target manually and automatically |
| AC-018 | Migration/restore exercises preserve authorised records and object references under the approved recovery policy |

Future evidence must record command/scenario, revision, environment, result and limitations. Test existence is not proof of acceptance.
