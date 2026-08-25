# 05 — Screen proctoring setting in the exam's BasicSettings

**What to build:** The exam detail BasicSettings box shows a read-only
Screen Proctoring row (always visible, like on the template detail page).
The BasicSettings edit dialog always contains the screen proctoring toggle,
but it is enabled only when the user holds the edit-screen-proctoring GUI
ability (backend grants it to institutional admins only — verified, exactly
the product owner's rule) and the exam's status permits the action; for
everyone else it renders disabled rather than vanishing. Saving splits the
patch: a changed screen proctoring flag goes to the dedicated exam
screen-proctoring activation endpoint (not the full exam update, not the
credentials-leaking settings endpoint), the remaining fields go through the
normal exam update, and the exam is refetched afterwards either way.

**Blocked by:** 04 — Exam groups box on the shared widget.

**Status:** ready-for-human

- [x] The BasicSettings box shows the exam's screen proctoring state,
      derived from the exam's additional attributes.
- [x] The edit dialog always shows the toggle; it is interactive only with
      the edit-screen-proctoring ability and a permitting exam status.
- [x] Toggling it calls the activation endpoint, then the refetched exam
      updates the box row and the Groups box (column/fallback row) without a
      page reload.
- [x] Saving without touching the toggle does not call the activation
      endpoint.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser check (dev server, super-admin/admin123): exam 11 — row shows
      enabled; dialog toggle interactive; toggling off and back on round-trips
      and the Groups box follows; exam 4 — row shows disabled.

## Comments

**2026-08-25 — Implemented**

- `BasicSettings` (exam model) gains `screenProctoringEnabled`; derived in
  `useBasicSettings` from `additionalAttributes.enableScreenProctoring`.
- Read-only row appended to the BasicSettings box items (boolean row, shared
  `screenProctoring.enabled.label` key, like the template box).
- Edit dialog always renders the switch; its disabled state comes from
  `useExamActionAccess(EDIT_SCREEN_PROCTORING).disabled` (ability + status),
  threaded as `screenProctoringEditDisabled` through box and dialog.
- Save split in `useBasicSettings.handleChange`: normal exam update first;
  only when the flag changed, POST
  `/exam/{id}/screen-proctoring/activation?enableScreenProctoring=…` (new
  `examService.activateScreenProctoring`), error-notified via
  `examDetail.boxes.basicSettings.errors.screenProctoringFailed`, then the
  silent `refetchExam` from ticket 04.
- Verification: `npx vue-tsc --noEmit` clean. Browser (dev server): exam 11 —
  row "Yes"; toggle off+save issued PUT /api/exam then POST
  activation?enableScreenProctoring=false then GET /api/exam/11; row flipped
  to "No" and the Groups box lost SP column + fallback row without reload;
  toggled back on the same way and both boxes returned. Save without
  touching the toggle issued only the PUT (network log). Exam 4 — row "No".
  Finished exam 9 — dialog opens, toggle present but disabled.
