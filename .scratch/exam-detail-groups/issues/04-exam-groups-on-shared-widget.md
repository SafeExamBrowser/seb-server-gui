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

**Status:** ready-for-agent

- [ ] Adding, editing, and deleting a client group on the exam detail page
      works end-to-end, including the confirmation dialog on delete.
- [ ] The screen proctoring column appears iff the exam has screen
      proctoring enabled; the add dialog's flag defaults on per ticket 02.
- [ ] The fallback row appears per the shared rules, is neither editable nor
      deletable, and shows the stored collecting-group name (legacy EXAM
      strategy included, with the generic fallback type label).
- [ ] After each mutation the fallback row / proctoring state reflect the
      refetched exam.
- [ ] Without the edit privilege all edit affordances are hidden; on a
      finished/archived exam they are visible but disabled.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser check (dev server, super-admin/admin123): exam 11 — column,
      fallback row, add (default-on flag), edit, delete all verified; exam 4
      (no screen proctoring) — no column, default-off flag; exam 5 (legacy
      EXAM strategy) — fallback row shows "Single Group".
