# 03 — Exams list Prepare button gated

**What to build:** On the Exams list, the "Prepare" button is disabled while
the institution lacks an Exam Template or an active Assessment Tool
Connection — silently, with no message and no info button. The user is
already inside the exam area here; the Navigation Overview is where the order
of steps is taught.

**Blocked by:** 02 — both prerequisites must already be answerable by the
shared composable.

**Status:** ready-for-agent

- [ ] The Exams list consumes the same shared composable as the Navigation
      Overview; readiness is not recomputed locally.
- [ ] The button is disabled when either prerequisite is unmet and resolved,
      and behaves exactly as today while unresolved, failed, or refused.
- [ ] No info button and no tooltip appear on this page.
- [ ] The button's ability gate is unchanged — a user who could not see it
      before still cannot.
- [ ] Browser verification in institution 6 with nothing set up: the button
      is visibly disabled and does not navigate.
- [ ] Browser verification as super administrator in institution 1: the
      button is unchanged and still opens the wizard.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
