# 04 — Exam Template list Add button gated

**What to build:** On the Exam Template list, the "Add" button is disabled
while the institution has no active Connection Configuration — silently, with
no message and no info button. Without this, a user told by the Navigation
Overview that the door is closed can still walk in through the side entrance
and land in the dead end.

**Blocked by:** 01 — the Connection Configuration prerequisite must already
be answerable. Independent of 02 and 03; can run in parallel with either.

**Status:** ready-for-agent

- [ ] The Exam Template list consumes the same shared composable as the
      Navigation Overview; readiness is not recomputed locally.
- [ ] The button is disabled when the prerequisite is unmet and resolved, and
      behaves exactly as today while unresolved, failed, or refused.
- [ ] No info button and no tooltip appear on this page.
- [ ] Browser verification in institution 6 with no active Connection
      Configuration: the button is visibly disabled and does not navigate.
- [ ] Browser verification as super administrator in institution 1: the
      button is unchanged and still opens the create form.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
