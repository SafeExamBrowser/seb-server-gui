# 04 — Exam Template list Add button gated

**What to build:** On the Exam Template list, the "Add" button is disabled
while the institution has no active Connection Configuration — silently, with
no message and no info button. Without this, a user told by the Navigation
Overview that the door is closed can still walk in through the side entrance
and land in the dead end.

**Blocked by:** 01 — the Connection Configuration prerequisite must already
be answerable. Independent of 02 and 03; can run in parallel with either.

**Status:** done

- [x] The Exam Template list consumes the same shared composable as the
      Navigation Overview; readiness is not recomputed locally.
- [x] The button is disabled when the prerequisite is unmet and resolved, and
      behaves exactly as today while unresolved, failed, or refused.
- [x] No info button and no tooltip appear on this page.
- [x] Browser verification in institution 6 with no active Connection
      Configuration: the button is visibly disabled and does not navigate.
- [x] Browser verification as super administrator in institution 1: the
      button is unchanged and still opens the create form.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).

---

**2026-08-31 — Implemented**

- `src/pages/(app)/exam-template/index.vue` consumes `useActionPrerequisites`
  and passes `isUnmet([CONNECTION_CONFIGURATION])` into `AddButton`'s existing
  `disabled` prop. No message, no tooltip, no local readiness logic.

Verification (dev server, Playwright):

- Institution 6 (`test-exam-admin`) with no active Connection Configuration:
  the Add button renders with `v-btn--disabled`, a Playwright click could not
  activate it ("element is not enabled") and the route did not change. No
  `.v-tooltip` on the page.
- Institution 1 (super-admin): the button is enabled and still opens
  `/exam-template/create`.
- `npx vue-tsc --noEmit`, eslint and prettier clean.
