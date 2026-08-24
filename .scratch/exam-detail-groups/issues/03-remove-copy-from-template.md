# 03 — Remove the copy-from-template machinery

**What to build:** The exam detail Groups box no longer offers copying client
groups from the exam template: the plus-button popover with the template's
groups disappears, along with the copy flow behind it (template-selection
fetch, copy mutation, the template-group-to-exam-group converter) and every
i18n key that only served it. The interim box keeps the plain groups list
with its delete action (privilege-hidden / status-disabled as today) — the
full replacement arrives with the next ticket. Dead code is deleted, not
parked; only unused hand-written seb-server models stay for Andrei's sweep.

**Blocked by:** 02 — Screen proctoring on by default for new groups.

**Status:** ready-for-agent

- [ ] The exam detail Groups box shows no add/copy affordance; listing and
      deleting groups still work.
- [ ] The copy flow's code and its now-unused i18n keys are gone (a grep for
      the keys finds no leftovers); no dead exports remain outside the
      hand-written seb-server models folder.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser check (dev server, super-admin/admin123): exam 11's Groups box
      lists its groups and deletes one successfully; no popover appears.
