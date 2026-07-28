# Exam-level screen proctoring toggle (side panel)

Status: needs-info
Parent: `.scratch/exam-detail-page/PRD.md` (deferred there under "Out of scope")
Depends on: SEBSERV-958 swap branch merged. Independent of issue 01.

## Goal

Re-add the exam-level "Apply Screen Proctoring" on/off switch the old exam
detail page had (in its "More exam options" card), as an action in the new
page's side-panel action stack.

## Design decisions (settled 2026-07-27 with Alain — don't relitigate)

1. **Form:** `ScreenProctoringAction.vue` in the side panel, cloned from the
   `SebLockAction` pattern (`ActionButton` with an active state), positioned
   directly **above "Apply SEB Lock"** (preserves the old more-options order).
2. **State source:** active ⇔
   `exam.additionalAttributes.enableScreenProctoring === "true"`. No extra
   fetch (unlike SEB lock, which needs its own check endpoint).
3. **Gating:** disabled unless
   `ability.canDoExamAction(GUIAction.EDIT_SCREEN_PROCTORING, exam)`.
4. **Service:** restore ONLY `activateScreenProctoring` from the deleted
   `screenProctoringService.ts` —
   `git show cb372564:client/src/services/seb-server/screenProctoringService.ts`
   — i.e. `POST /exam/{id}/screen-proctoring/activation` with
   `enableScreenProctoring` as query param. Leave `applyScreenProctoringGroups`
   in git history (its fate hangs on the Andreas question in issue 01).
   Rewrite the restored function to current conventions (hey-api generated SDK /
   `useMutation`) rather than pasting the old `apiService` style verbatim.
5. **Data flow:** the endpoint returns the updated `Exam`; on success replace
   `exam` in `useExamDetailPage` — same as the test-run action. Toggle-off is
   the same endpoint with `false`.
6. **i18n:** new keys `examDetail.sidePanel.actions.applyScreenProctoring` and
   `examDetail.sidePanel.actions.screenProctoringApplied`, `en.json` only.

## Implementation notes

- Wire through `useExamDetailPage` like the other actions: a
  `useScreenProctoringAction(exam, examId)` composable returning a
  `handleScreenProctoringToggle`, exposed via the page composable's `actions`.
- Old behaviour reference (switch semantics, revert-on-failure):
  `git show cb372564:"client/src/pages/(app)/exam/[id]/components/ExamDetailMain.vue"`
  (`applyScreenProctoring` / `changeScreenProctoringSettings`, ~lines 1256-1295).

## Acceptance

- Side panel shows the action above "Apply SEB Lock"; clicking toggles the
  exam-level flag and the button's active state follows
  `additionalAttributes.enableScreenProctoring` from the returned exam.
- Disabled when `EDIT_SCREEN_PROCTORING` is not allowed for the exam's status.
- `npx vue-tsc --noEmit`, eslint, prettier pass; browser-verify via Playwright
  against the dev server (login super-admin/admin123; exam 7 running is
  toggleable, exam 9 finished shows it per status rules; see PRD
  "Dev environment").

## Comments

- 2026-07-28 (Alain): Requirements changed since this was specced; the ticket
  needs revision before implementation. Set back to `needs-info` so no agent
  picks it up. Do not implement as written — wait for Alain to update the spec
  and restore `ready-for-agent`.
