# 02 — Screen proctoring on by default for new groups

**What to build:** When adding a new client group in the shared client-groups
table widget, the screen proctoring flag starts enabled whenever screen
proctoring is allowed for groups (the same derived flag that controls the
screen proctoring column); otherwise it starts disabled as today. This
applies to every consumer of the widget — template-creation wizard, template
detail page, and (once it exists) the exam detail groups box.

**Blocked by:** 01 — Access contract for the shared client-groups table.

**Status:** done

- [x] The add-group dialog opens with the screen proctoring toggle on iff
      screen proctoring is allowed for groups.
- [x] Editing an existing group still shows that group's stored flag,
      untouched by the new default.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser check (dev server, super-admin/admin123): on a screen-proctored
      template's detail page the add dialog opens with the toggle on; on a
      template without screen proctoring the toggle is absent/off as today.

## Comments

**2026-08-25 — Implemented**

- `getEmptyClientGroup` in the shared table's `useTable` now seeds
  `screenProctoringEnabled` from the derived
  `screenProctoringAllowedForGroups` flag (read at dialog-open time via
  `createConfig.getItem`).
- Verification: `npx vue-tsc --noEmit` clean. Browser (dev server):
  template 54 (SP on) add dialog opens with the toggle checked; editing the
  SP=No group "asdf" still shows it unchecked; template 53 (SP off) add
  dialog has no toggle, as before. Wizard (SP enabled in step 1) groups step:
  add dialog opens with the toggle checked; add/edit affordances unchanged —
  covers the ticket 01 wizard regression too. Wizard abandoned without
  saving.

**2026-09-01 — Human-tested by Alain; closed as done.**
