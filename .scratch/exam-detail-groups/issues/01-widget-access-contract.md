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

**Status:** ready-for-agent

- [ ] The widget's deps accept an optional access contract with reactive
      hidden and disabled states.
- [ ] Hidden removes the plus button and all row action buttons; disabled
      renders them disabled; neither affects the read-only table content or
      the fallback row.
- [ ] Consumers without the access contract behave exactly as before.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser regression (dev server, super-admin/admin123): template detail
      page and template-creation wizard groups step still allow add, edit,
      and delete as today.
