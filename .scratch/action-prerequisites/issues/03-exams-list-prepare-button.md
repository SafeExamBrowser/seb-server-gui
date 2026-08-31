# 03 — Exams list Prepare button gated

**What to build:** On the Exams list, the "Prepare" button is disabled while
the institution lacks an Exam Template or an active Assessment Tool
Connection — silently, with no message and no info button. The user is
already inside the exam area here; the Navigation Overview is where the order
of steps is taught.

**Blocked by:** 02 — both prerequisites must already be answerable by the
shared composable.

**Status:** done

- [x] The Exams list consumes the same shared composable as the Navigation
      Overview; readiness is not recomputed locally.
- [x] The button is disabled when either prerequisite is unmet and resolved,
      and behaves exactly as today while unresolved, failed, or refused.
- [x] No info button and no tooltip appear on this page.
- [x] The button's ability gate is unchanged — a user who could not see it
      before still cannot.
- [x] Browser verification in institution 6 with nothing set up: the button
      is visibly disabled and does not navigate.
- [x] Browser verification as super administrator in institution 1: the
      button is unchanged and still opens the wizard.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).

---

**2026-08-31 — Implemented**

- `src/pages/(app)/exam/index.vue` consumes `useActionPrerequisites` and
  passes `isUnmet([EXAM_TEMPLATE, ASSESSMENT_TOOL_CONNECTION])` into
  `AddButton`'s existing `disabled` prop. No message, no tooltip, no local
  readiness logic; the `canView(CREATE_EXAM_WIZARD)` gate is untouched.

Verification (dev server, Playwright):

- Institution 6 (`test-exam-admin`) with the Connection Configuration and
  the Assessment Tool Connection deactivated: the Prepare button renders
  with `v-btn--disabled`, a Playwright click could not activate it ("element
  is not enabled") and the route did not change. No `.v-tooltip` on the page.
- Institution 1 (super-admin): the button is enabled and still opens
  `/exam/create`.
- `npx vue-tsc --noEmit`, eslint and prettier clean.
