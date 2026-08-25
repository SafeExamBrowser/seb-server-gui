# 07 — Apply screen proctoring groups on group mutations

**What to build:** The exam Groups box makes the screen proctoring flag
actually stick by calling the dedicated apply-groups endpoint after group
mutations. This is a deliberate **workaround**: the client orchestrates two
requests that should be one atomic backend operation. Andreas will add a
single exam-groups endpoint later; until then the adapter carries the logic
and a single TODO marks the replacement point.

Settled 2026-08-25 in a grilling session with Alain, grounded in the backend
source (`SafeExamBrowser/seb-server` @ `development`) — don't relitigate the
decisions below.

**Blocked by:** — (follow-up to 04/05, both done)

**Status:** ready-for-human

## Backend facts (verified in source)

- `POST /exam/{modelId}/screen-proctoring/apply-groups` with query param
  `spsSEBGroupsSelection` (comma-separated client-group ids) **replaces the
  whole selection** (blank/absent clears it), saves the SP settings, and runs
  the group sync synchronously (`ExamAdministrationController.screenProctoringGroupApply`
  → `ExamAdminServiceImpl.applyClientGroupsToScreenProctoring`).
- ⚠️ The call **force-sets `enableScreenProctoring = true`** while saving —
  calling it on a non-SP exam silently enables screen proctoring. Hence the
  hard gating below.
- Under `APPLY_SEB_GROUPS` the sync treats the selection as source of truth:
  newly selected groups get SPS groups created, deselected/deleted ones get
  their SPS groups deleted (remotely and locally), renames propagate, the
  fallback group is maintained (`ScreenProctoringAPIBinding.synchronizeFromSEBGroups`).
  Under the legacy `EXAM` strategy the selection is ignored.
- Backend mutation hooks: group **PUT** already triggers a full re-sync,
  **POST and DELETE trigger no sync** — so only apply-groups adds a group to
  the selection, and after deleting a flagged group the SPS-side recording
  group lingers until our apply-groups call cleans it up.
- Because the sync runs inside the request, the existing `refetchAll` right
  after it sees the updated derived `isSPSGroup` flags.

## Decisions

- **Service function:** `applyScreenProctoringGroups(id, spsSEBGroupsSelection)`
  in `client/src/services/seb-server/examService.ts`, next to
  `activateScreenProctoring`, same query-param `postRequest` style.
- **Adapter follow-up calls** in `useClientGroupsBox.ts` on all three
  mutations: create (flag on → selection + new id from the POST response),
  update (desired flag ≠ derived flag → id added/removed), delete (group was
  flagged → selection minus id).
- **Selection source:** flagged ids from the last fetched wire rows in
  `groupsFetch` (`isSPSGroup`), adjusted by the mutation delta. No extra
  round-trip; self-heals stale selection entries.
- **Hard gating:** call only when the exam's screen proctoring is enabled
  **and** `collectingStrategy` is `APPLY_SEB_GROUPS` **and** there is an
  actual flag delta.
- **Failure handling:** no dedicated error, no rollback. `refetchAll` still
  runs (so the table shows real server state) and the error propagates to
  the CRUD dialog's generic save-failed handling.
- **Payload:** keep sending `isSPSGroup` on POST/PUT; add a comment in
  `toExamClientGroup` explaining the backend ignores it there and
  apply-groups is the real mechanism.
- **Single TODO** above the adapter's apply-groups helper (the selection
  computation + gating + call in `useClientGroupsBox.ts`), exactly:
  `TODO @Andreas: replace this by calling the new exam groups endpoint, once it exists`
  — that helper is precisely the client-side business logic the future
  atomic endpoint makes obsolete. No TODO anywhere else.

## Acceptance

- [x] Creating a group with the toggle on shows Screen Proctoring "Yes"
      after the refetch; network log shows the apply-groups call with the
      full selection including the new id.
- [x] Toggling the flag off/on via edit updates the column and the selection
      csv accordingly.
- [x] Deleting a flagged group fires apply-groups with the id removed.
- [x] Mutations without a flag delta, and any mutation on a non-SP exam
      (e.g. exam 4) or non-APPLY_SEB_GROUPS exam, fire no apply-groups call.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser check on the dev server (super-admin/admin123) on exam 11
      (SP + APPLY_SEB_GROUPS) and exam 4 (SP off), evidence from the network
      log; no unit tests per standing decision.

## Comments

**2026-08-25 — Implemented**

- `applyScreenProctoringGroups(id, spsSEBGroupsSelection)` added to
  `examService.ts` next to `activateScreenProctoring`, same query-param
  `postRequest` style.
- Adapter helper `applyScreenProctoringGroups({ add?, remove? })` in
  `useClientGroupsBox.ts` carries the single `TODO @Andreas` marker:
  gates on SP enabled + `APPLY_SEB_GROUPS`, computes the selection from the
  flagged wire rows (fallback row excluded) plus the mutation delta.
  Callers gate on the flag delta: create (toggle on + new id from the POST
  response), update (desired ≠ derived `isSPSGroup`), delete (group was
  flagged). Apply call wrapped `try/finally` so `refetchAll` always runs
  and errors propagate to the dialog's generic handling.
- `toExamClientGroup` got the comment that the backend ignores `isSPSGroup`
  on POST/PUT.
- Verification (dev server, super-admin, network log):
  - Exam 11 create "Apply Test A" (toggle on) → `POST …/exam/11/screen-proctoring/apply-groups?spsSEBGroupsSelection=52`,
    column shows Yes after refetch.
  - Edit toggle on "Manual Gropu" → `…spsSEBGroupsSelection=52,43`; toggle
    back off → `…spsSEBGroupsSelection=52`; column updates both ways.
  - No-delta edit (save unchanged) → PUT only, no apply-groups call.
  - Delete flagged "Apply Test A" → `…spsSEBGroupsSelection=` (blank clears).
  - Exam 4 (SP off): create + delete of "Apply Test B" fired no apply-groups
    call. Test data cleaned up on both exams.
  - `npx vue-tsc --noEmit`, eslint and prettier clean.
- Code review findings, both addressed:
  - Delete path: an apply-groups failure had no handler (the confirm dialog
    has no generic catch, unlike the create/update FormDialog), leaving the
    dialog stuck with no feedback → now caught and reported via
    `notify.serverError` with the existing deleteFailed title; `refetchAll`
    still runs.
  - The `collectionStrategy` gate is inert today (the exam GET carries no
    `spsCollectingStrategy`; `getScreenProctoringForExam` hardcodes
    `APPLY_SEB_GROUPS`) → kept as future-proofing with a comment saying so;
    the effective guard is `enabled`.

**2026-08-25 — Pre-merge re-verification (full manual suite re-run)**

- Bug report "flag not updated on exam 5" diagnosed as legacy data, not a
  regression: exam 5's stored SP settings (`GET /exam/5/screen-proctoring`)
  have `spsCollectingStrategy: EXAM`, under which the backend sync ignores
  the selection (`ScreenProctoringAPIBinding.synchronizeGroups` switches to
  `synchronizeExamSingleGroup`) while apply-groups still returns 200 and
  persists the selection. The client cannot see the strategy — the exam GET
  strips it (`ExamAdditionalAttributeSerializer`); only the settings GET
  (which also leaks the SP secrets in plaintext) carries it. Decision with
  Alain: leave it — legacy `EXAM` exams will be migrated soon.
- All acceptance tests re-run on the dev server (Playwright, super-admin),
  exam 11 (SP + APPLY_SEB_GROUPS) and exam 4 (SP off), all green:
  - Create "Apply Test A" (toggle on, id 58) →
    `apply-groups?spsSEBGroupsSelection=58`, column Yes, wire
    `isSPSGroup: true`.
  - Edit toggle on "new group" (55) → `…=58,55`, column Yes; toggle back
    off → `…=58`, column No.
  - No-delta save on "testgriuo alain" → PUT only, no apply-groups.
  - Delete flagged "Apply Test A" → `…spsSEBGroupsSelection=` (blank
    clears).
  - Create + delete unflagged "Apply Test B" → no apply-groups on either.
  - Exam 4: SP column and dialog switch absent; create + delete
    "Apply Test C" → no apply-groups/screen-proctoring calls.
  - Test data cleaned up on both exams; `npx vue-tsc --noEmit` and eslint
    clean.
