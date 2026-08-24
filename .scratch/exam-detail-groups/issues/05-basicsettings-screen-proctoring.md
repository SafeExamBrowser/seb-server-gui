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

**Status:** ready-for-agent

- [ ] The BasicSettings box shows the exam's screen proctoring state,
      derived from the exam's additional attributes.
- [ ] The edit dialog always shows the toggle; it is interactive only with
      the edit-screen-proctoring ability and a permitting exam status.
- [ ] Toggling it calls the activation endpoint, then the refetched exam
      updates the box row and the Groups box (column/fallback row) without a
      page reload.
- [ ] Saving without touching the toggle does not call the activation
      endpoint.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser check (dev server, super-admin/admin123): exam 11 — row shows
      enabled; dialog toggle interactive; toggling off and back on round-trips
      and the Groups box follows; exam 4 — row shows disabled.
