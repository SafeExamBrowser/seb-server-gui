# 04 — Exam groups box on the shared widget

**What to build:** The exam detail Groups box works like the template detail
page's: rendered by the shared client-groups table widget with a plus button
(add dialog), edit and delete row actions, a screen proctoring column when
the exam has screen proctoring enabled, and the Screen Proctoring Fallback
Group as a fixed, non-editable row under the same rules as on the template
pages (derived from the exam's additional attributes via a new exam-flavored
helper beside the template-flavored one; a missing collecting strategy
renders as APPLY_SEB_GROUPS, so legacy EXAM-strategy exams simply show their
stored name with the fallback type label). The exam side adapts at the deps
boundary: incoming exam-API groups are parsed tolerantly into the widget's
strict shape (`isSPSGroup` ↔ `screenProctoringEnabled`; invalid rows dropped
with a console warning), and create/update/delete map back to the exam wire
shape against the exam-scoped client-group endpoints. Mutations refetch both
the groups list and the exam. Controls are hidden without the
edit-client-groups privilege and disabled by exam status, via the access
contract from ticket 01. The exam's additional-attributes type gains the two
optional sps fields; the adapter carries a TODO for Andrei (hey-api
ClientGroup types shrink it later — no TODOs inside generated api types).

**Blocked by:** 03 — Remove the copy-from-template machinery.

**Status:** ready-for-human

- [x] Adding, editing, and deleting a client group on the exam detail page
      works end-to-end, including the confirmation dialog on delete.
- [x] The screen proctoring column appears iff the exam has screen
      proctoring enabled; the add dialog's flag defaults on per ticket 02.
- [x] The fallback row appears per the shared rules, is neither editable nor
      deletable, and shows the stored collecting-group name (legacy EXAM
      strategy included, with the generic fallback type label).
- [x] After each mutation the fallback row / proctoring state reflect the
      refetched exam.
- [x] Without the edit privilege all edit affordances are hidden; on a
      finished/archived exam they are visible but disabled.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser check (dev server, super-admin/admin123): exam 11 — column,
      fallback row, add (default-on flag), edit, delete all verified; exam 4
      (no screen proctoring) — no column, default-off flag; exam 5 (legacy
      EXAM strategy) — fallback row shows "Single Group".

## Comments

**2026-08-25 — Implemented**

- Exam Groups box is now `DetailBox` + shared `ClientGroupsTable`;
  `useClientGroupsBox` builds the full deps (adapter, screen proctoring,
  access, mutations) and the box only renders.
- Adapters in `utils/examClientGroupAdapters.ts`: `parseExamClientGroup`
  (tolerant `safeParse`, `isSPSGroup` → `screenProctoringEnabled`, invalid
  rows dropped with a console warning) and `toExamClientGroup` (strict shape
  → exam wire shape with `examId`/`isSPSGroup`); carries the TODO for Andrei.
- `ExamAdditionalAttributes` gains optional `enableScreenProctoring` /
  `spsCollectingGroupName`; `getScreenProctoringForExam` (utils/clientGroup)
  maps them to the widget's screen proctoring deps (missing strategy renders
  as APPLY_SEB_GROUPS, display only).
- Mutations refetch groups + exam; the exam refetch is a new silent
  `refetchExam` on `useExamDetailPage` (updates `exam` in place instead of
  flipping the page-level loading state, which would unmount the panel).
- Access: `useExamActionAccess(EDIT_CLIENT_GROUPS)` feeds the ticket 01
  access contract (privilege hides, status disables).
- i18n: exam-side `title`/`headers`/`deleteDialog` keys removed (the widget
  brings its own); `errors.deleteFailed` kept for the delete notification.
- Verification: `npx vue-tsc --noEmit` clean. Browser (dev server): exam 11 —
  SP column + "Fallback Group" row (no actions), add dialog default-on,
  created "Manual Gropu" (POST carried `isSPSGroup=true`), edited it (PUT
  carried `isSPSGroup=true`), deleted it via the confirm dialog (detail text
  shows the group name), then recreated it; list and fallback row refreshed
  after each mutation. Exam 4 — no SP column, no SP toggle in the dialog.
  Exam 5 (legacy EXAM) — fallback row "Single Group" with the generic
  fallback label. Exam 9 (Finished) — Add/Edit/Delete visible but disabled.
  Hidden-when-unprivileged not browser-tested (no supporter login at hand);
  it rides the same ticket 01 contract driven by the pre-existing
  `useExamActionAccess` hidden flag.
- **Backend finding for Andreas:** the exam client-group POST and PUT both
  ignore `isSPSGroup` — the GUI sends `true`, the response comes back
  `false` (create and update verified via network log). GUI-side handling is
  correct; flag persistence needs a backend fix.
