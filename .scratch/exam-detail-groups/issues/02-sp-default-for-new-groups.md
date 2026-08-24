# 02 — Screen proctoring on by default for new groups

**What to build:** When adding a new client group in the shared client-groups
table widget, the screen proctoring flag starts enabled whenever screen
proctoring is allowed for groups (the same derived flag that controls the
screen proctoring column); otherwise it starts disabled as today. This
applies to every consumer of the widget — template-creation wizard, template
detail page, and (once it exists) the exam detail groups box.

**Blocked by:** 01 — Access contract for the shared client-groups table.

**Status:** ready-for-agent

- [ ] The add-group dialog opens with the screen proctoring toggle on iff
      screen proctoring is allowed for groups.
- [ ] Editing an existing group still shows that group's stored flag,
      untouched by the new default.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser check (dev server, super-admin/admin123): on a screen-proctored
      template's detail page the add dialog opens with the toggle on; on a
      template without screen proctoring the toggle is absent/off as today.
