# Type-with-details column for the exam detail Groups box

Status: done
Parent: `.scratch/exam-detail-page/PRD.md`
Branch: `SEBSERV-958_groups`
Builds on: `.scratch/exam-detail-page/issues/01-groups-box.md` (implemented,
staged/committed on this branch — read it first for the box's design)

## Goal

The Groups box on `/exam/:id` currently shows only a group's name and type;
there is no way to see the criteria (IP range, OS, letter range). Replace the
box's Type column with a single **type-with-details** column in the format the
exam-template wizard summary already uses:

- `IP v4 Range (10.0.0.1 – 10.0.0.99)`
- `SEB Client OS (Windows)`
- `Alphabetical User Name Range (A – M)`

Columns become: **name, type-with-details, actions**. The column header stays
"Type" (existing `examDetail.boxes.clientGroups.headers.type` key).

## Design decisions (settled 2026-08-03 with Alain — don't relitigate)

1. **One combined column**, not a separate criteria column (wizard-summary
   format above; the type label leads the string).
2. **Shared helper with the exhaustiveness check inside it.** Extract the
   template wizard's `getTypeDetails` closure
   (`pages/(app)/exam-template/create/components/stepSummary/helpers/getSummaryClientGroups.ts`)
   into a shared helper — planned home `src/utils/clientGroup.ts`, together
   with its `CLIENT_OS_LABEL_I18N_KEYS` record. Input type is the existing
   template `ClientGroup` discriminated union
   (`models/seb-server/examTemplate.ts`); the exhaustive `switch` +
   `satisfies never` lives in the helper. The template-create wizard summary
   delegates to it; its rendered output must stay byte-identical.
3. **Display-side bridge for flat exam rows.** The box's rows are the flat
   exam model (`models/seb-server/clientGroup.ts`). Bridge per row, display
   only: `{ ...row, screenProctoringEnabled: row.isSPSGroup ?? false }` →
   `clientGroupSchema.safeParse` (exported from
   `models/seb-server/examTemplate.ts`) → on success call the helper.
   Do **not** change the flat model or `clientGroupService`. (Note: the
   existing `clientGroupSchema` requires `screenProctoringEnabled`, which is
   why the bridge fills it; the exam wire name for the same concept is
   `isSPSGroup`.)
4. **Fallback for rows that don't parse** (e.g. type `SP_FALLBACK_GROUP`,
   missing criteria fields): show the translated type label alone, no
   parentheses — i.e. the box's current `typeLabel` behavior (raw type string
   for unknown enum values). A data anomaly must never blank the type info.
5. **Copy carries the SP flag** (supersedes decision 3 of issue 01):
   `templateGroupToClientGroup` additionally sends
   `isSPSGroup: templateGroup.screenProctoringEnabled` in the POST payload
   (`POST /client-group` accepts `isSPSGroup` per the OpenAPI spec). Add an
   **inline comment at that line** telling Alain to revisit it once screen
   proctoring semantics for exam client groups are clarified with Andreas.
6. **Popover subtitles use the same combined string.** Template groups are
   union-typed already — direct helper call, no bridge.
7. **Fix the exam-create wizard summary too.** Its
   `pages/(app)/exam/create/components/stepSummary/helpers/getSummaryClientGroups.ts`
   renders the type as `i18n.global.t(group.type)` — the key doesn't exist,
   so the summary shows the raw enum string ("IP_V4_RANGE") and violates the
   i18n static-key rule. Switch it to the shared helper with the same
   bridge-and-fallback as the box (its rows are flat exam groups).

## Implementation notes

- No new i18n keys: the helper reuses `clientGroups.fields.type.types.*` and
  `clientGroups.fields.clientOS.types.*`; en.json stays untouched.
- The box's local `TYPE_LABEL_I18N_KEYS` record
  (`BoxClientGroups/BoxClientGroups.vue`) remains as the fallback path
  (decision 4); the combined string comes from the helper.
- TDD seams: unit tests for the shared helper (all three types + the
  wizard-format strings), and extend
  `client/tests/unit/boxClientGroups/templateGroupToClientGroup.test.ts` to
  assert the copied `isSPSGroup` value (true and false cases).
- Mind the eslint rule: no `../` parent-directory imports — use `@/...`.

## Open question (for Andreas — parked, does not block this ticket)

In addition to the per-group SP question parked in issue 01: does creating an
exam client group with `isSPSGroup: true` affect a running exam with screen
proctoring active (e.g. group-based collection), or is the flag inert until
`apply-groups` is called?

## Acceptance

- Groups box table shows name, type-with-details, actions; e.g. a copied IP
  group renders `IP v4 Range (10.0.0.1 – 10.0.0.99)`.
- Popover entries show the same combined string as subtitle.
- Copying a template group whose SP flag is set POSTs
  `isSPSGroup=true`; unset POSTs `isSPSGroup=false` (verify payload in the
  browser network log).
- A group row whose type/criteria don't parse falls back to the translated
  type label alone (no crash, no empty cell).
- Template-create wizard summary output unchanged; exam-create wizard summary
  now shows translated type-with-details instead of the raw enum string.
- `npx vue-tsc --noEmit`, eslint, prettier, vitest pass; browser-verify via
  Playwright against the dev server (login super-admin/admin123; see PRD "Dev
  environment" — exam 5 / template 71 carry usable fixtures from issue 01).

## Comments

- 2026-08-03 (Alain, via grilling session): Created. All decisions above
  settled; supersedes issue 01 decision 3 (SP flag now copied) and issue 01's
  plain-type column/popover subtitle.
- 2026-08-03 (agent): Implemented. Shared helper
  `getClientGroupTypeDetails` + `CLIENT_OS_LABEL_I18N_KEYS` extracted to
  `src/utils/clientGroup.ts` (switch is character-identical to the old
  closure); template-create wizard summary delegates to it. Box column and
  popover subtitle use the combined string (bridge → `safeParse` → helper,
  `typeLabel` fallback); exam-create wizard summary fixed the same way;
  `templateGroupToClientGroup` now sends `isSPSGroup` with the revisit
  comment. TDD: `tests/unit/utils/clientGroup.test.ts` (all three
  wizard-format strings) and
  `tests/unit/boxClientGroups/templateGroupToClientGroup.test.ts` (all three
  criteria mappings, isSPSGroup true/false) — note the latter was *created*,
  not extended: issue 01's claimed test file was never committed (b0ad9fc0
  contains no tests/unit files). Verification: vue-tsc, eslint (repo-wide),
  prettier, vitest (7 tests) pass; Playwright on dev server: exam 5 table
  renders `IP v4 Range (10.0.0.1 – 10.0.0.99)` / `SEB Client OS (Windows)`,
  popover subtitles ditto; copy POSTs `isSPSGroup=false` (Windows Clients)
  and `isSPSGroup=true` (Lab IP Range, after enabling its SP flag on the
  template); fallback verified via mocked `/api/client-group` response
  (`SP_FALLBACK_GROUP` → raw type, criteria-less `IP_V4_RANGE` → "IP v4
  Range", no crash/blank); exam-create wizard summary (quiz 2 + template 71
  through step 7) shows the combined strings instead of raw enums.
  **Backend observation for the Andreas question:** the POST carried
  `isSPSGroup=true` but the created exam group came back `isSPSGroup:false`
  (exam 5, SP not group-based at exam level) — the flag seems ignored on
  create there. **Dev-data side effects left in place:** template 71 SP
  grouping strategy switched EXAM → APPLY_SEB_GROUPS and "Lab IP Range" now
  has SP enabled (needed for the true-case payload check; also makes the
  exam-create wizard grow an "Add Groups" step for that template); exam 5
  gained one "Windows Clients" and one "Lab IP Range" copy (now 7 groups).
  No exam was created from the wizard walk (stopped before Save). Review
  (Standards + Spec agents): no hard violations; both flagged the
  bridge+fallback block being duplicated between `BoxClientGroups.vue` and
  the exam-create summary helper — left as is because the ticket settles
  that the box's local record stays; consolidate later if wanted.
- 2026-08-03 (Alain): Three adaptations: (1) do consolidate the duplicated
  bridge+fallback into `utils/clientGroup.ts` (supersedes the "box's local
  record remains" implementation note); (2) no unit tests at the moment —
  remove the new test files (supersedes the TDD-seams note and the vitest
  acceptance line); (3) since the backend ignores the flag anyway, hardcode
  `isSPSGroup: false` in the copy payload instead of copying the template's
  SP flag (supersedes decision 5), keep a TODO marking it as the open
  question with Andreas.
- 2026-08-03 (agent): Adaptations applied. `utils/clientGroup.ts` now also
  owns `TYPE_LABEL_I18N_KEYS`/`typeLabel` (private) and exports
  `getExamClientGroupTypeDetails(group)` (bridge + fallback for flat exam
  groups); `BoxClientGroups.vue` and the exam-create summary helper both
  call it and lost their local copies. `templateGroupToClientGroup` sends
  `isSPSGroup: false` hardcoded, with the TODO explaining the backend
  ignored `true` on create and pointing at the Andreas question. Both unit
  test files deleted (`tests/unit/` back to `sanity.test.ts` only).
  Verification: vue-tsc, repo-wide eslint, prettier pass; Playwright on
  exam 5 — table still renders the combined strings, copying the
  SP-enabled "Lab IP Range" POSTs `isSPSGroup=false`, and the test copy
  was deleted again (exam 5 back to its 7 documented groups).

**2026-09-01 — Human-tested by Alain; closed as done.**
