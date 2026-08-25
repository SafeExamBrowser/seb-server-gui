# 01 — Access contract for the shared client-groups table (prefactor)

**What to build:** The shared client-groups table widget can be told, via an
optional access contract in its deps (hidden/disabled refs), to hide or
disable its editing affordances: hidden removes the plus button and the row
action buttons entirely; disabled shows them grayed out. The underlying crud
table widget learns whatever it is missing to support this (today it can only
disable the plus button). Consumers that pass no access contract keep exactly
today's always-editable behavior — this ticket changes nothing user-visible
on the template wizard or the template detail page.

**Blocked by:** None — can start immediately.

**Status:** ready-for-human

- [x] The widget's deps accept an optional access contract with reactive
      hidden and disabled states.
- [x] Hidden removes the plus button and all row action buttons; disabled
      renders them disabled; neither affects the read-only table content or
      the fallback row.
- [x] Consumers without the access contract behave exactly as before.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser regression (dev server, super-admin/admin123): template detail
      page and template-creation wizard groups step still allow add, edit,
      and delete as today.

## Comments

**2026-08-25 — Implemented**

- `ClientGroupsTableDeps.access?` carries `hidden`/`disabled` refs; `useTable`
  passes it through to the crud table config and drops the Actions column
  entirely when hidden.
- `CrudTableConfig.access?` (`CrudTableAccess`, MaybeRef hidden/disabled):
  `CrudTable` hides the create button when hidden and disables it when
  disabled (combined with the existing `createConfig.allowed`);
  `CrudActions`/`CrudUpdate`/`CrudDelete` gained `hidden`/`disabled` props.
- Verification: `npx vue-tsc --noEmit` clean. Browser (dev server, template
  54 "Alain ClientGroups Test"): Groups box unchanged — Add Group button,
  edit/delete on rows, fallback row without actions; add and edit dialogs
  open and cancel as before. Wizard groups step regression covered in the
  ticket 02 session (same shared-widget path; no-access consumers are
  code-identical to before).
