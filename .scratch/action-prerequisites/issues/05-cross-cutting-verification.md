# 05 — Cross-cutting verification

**What to build:** No new behaviour. The checks that no single slice can
cover on its own, run against the finished feature, plus a clear record of
what was left behind on the dev server.

**Blocked by:** 02, 03, 04.

**Status:** done

- [x] The failed-request path is verified with stubbed responses — the only
      state that cannot be produced from real data. Every gated action stays
      live and no message appears when a prerequisite check fails.
- [x] A fully populated institution is verified end to end: the Navigation
      Overview, the Exams list and the Exam Template list show no change
      whatsoever from before this feature.
- [x] The info button is verified reachable and readable by keyboard alone —
      it is the only focusable element on a dead item — and by tap on a touch
      viewport.
- [x] No gated action ever flashes from live to dead on a cold page load in
      an institution where the prerequisites are unmet.
- [x] Typecheck passes across the finished feature (`npx vue-tsc --noEmit` in
      `client/`).
- [x] What was left in institution 6 is reported: the account created, and
      which entities were removed or deactivated. No restoration is required
      — institution 6 is disposable test data, exam 17 included.
- [x] Any follow-up worth filing is named, in particular the wizard-step
      empty state that would replace a route guard for bookmarked deep links,
      and the outcome of the connection configuration active-filter question
      from ticket 01 if it turned out the filter is ignored.

---

**2026-08-31 — Verified**

**Failed-request path (stubbed).** All three prerequisite reads
(`/client_configuration/names`, `/lms-setup/active`,
`/admin-api/v1/exam-template/names`) stubbed to HTTP 500 via `page.route`,
against institution 6 in its fully empty state — where every action is dead
without the stub. Result on all three pages: "Create Exam Template",
"Prepare Exam" and "Prepare Exam with URL" were live links, zero info buttons
rendered, and the Exams "Prepare" and Exam Template "Add" buttons were
enabled. A failed check leaves the GUI exactly as it was.

**Fully populated institution (super-admin, institution 1).** All 15
Navigation Overview items are `<a class="link-color nav-link">`, zero
`opacity-50`, zero info buttons; the Exams "Prepare" and Exam Template "Add"
buttons enabled with no `.v-tooltip` anywhere. No change whatsoever.

**Keyboard.** Tab from "User Accounts" lands on the info button — the only
focusable element on a dead item — announcing "Why this action is
unavailable"; focus alone opens the tooltip; a further Tab moves on to "Exam
Templates", so the button is not a trap.

**Touch.** In a `hasTouch` context, `touchscreen.tap` on the "Prepare Exam"
info button revealed both messages.

**Cold-load flash — this check does NOT hold as written.** Sampling the DOM
every animation frame from page load, in institution 6 with the
prerequisites unmet:

| Page                                                         | live → dead                                     |
| ------------------------------------------------------------ | ----------------------------------------------- |
| Navigation Overview ("Create Exam Template", "Prepare Exam") | 307 ms → 422 ms (115 ms visible as a live link) |
| Exam Template list ("Add")                                   | 400 ms → 422 ms (22 ms enabled)                 |
| Exams list ("Prepare")                                       | 311 ms → 343 ms (32 ms enabled)                 |

This is the direct and unavoidable consequence of the settled state model
(unknown counts as ready): the action must render live until the check
resolves. The PRD's expectation that abilities and prerequisites land
together is close but not exact — abilities arrive first and the
prerequisite answer follows one request later. Eliminating the window would
require disabled-while-loading, which the PRD rejects on purpose. Reported,
not "fixed"; the decision is Alain's.

**e2e suite.** The mocked backend answers unmatched `/api/` reads with `{}`,
which the seam read as "resolved and empty", so
`06-exam/2.2-read-get-all › H add button navigates to the create page`
failed on a disabled Prepare button — a genuine regression. Fixed by giving
`mock-backend.ts` the three prerequisite reads, so the mocked institution is
fully set up; that test passes again. Note the suite has ~58 pre-existing
failures on this machine, identical before and after this feature (verified
by running the suite against the pre-feature commit in a separate worktree);
re-running the affected specs in isolation against a clean local dev server
showed all of them passing with this feature's code, so they are environment
flakiness, not regressions.

**Typecheck.** `npx vue-tsc --noEmit`, `npm run typecheck:playwright`,
eslint and prettier all clean.

**Left behind in institution 6** (disposable test data, nothing restored):

- No account was created: `test-exam-admin` / `Admin-Test-2026!` already
  carries INSTITUTIONAL_ADMIN there.
- Connection Configuration 7 "Prereq Verification Config" — created, and
  left **deactivated**.
- LMS Setup 6 "Prereq Verification Tool" (MOCKUP,
  `http://mockup.example.org`, client name/secret `lmsMockup`) — created,
  and left **deactivated**.
- Exam Template 92 "Prereq Verification Template" — created and then hard
  deleted.
- Net effect: institution 6 is back to no active Connection Configuration,
  no active Assessment Tool Connection and no Exam Template, so every gated
  action there is dead.

**Follow-ups worth filing**

1. _Empty state on the wizard steps._ Deep links (bookmark, history, typed
   URL) still reach the exam wizard and the exam template form with an empty
   selector. The PRD rules out a route guard; an empty state on the step
   itself is the fix.
2. _The cold-load window above_, if the flicker turns out to bother anyone.
3. Not needed: the connection-configuration `active` filter question from
   ticket 01 is answered — the backend honours it (institution 1:
   `?active=true` → the 2 active rows, `?active=false` → the 3 inactive,
   unfiltered → all 5). Only the generated OpenAPI types omit the parameter,
   which is worth a note to the backend team but changes nothing in the GUI.

---

**2026-09-01 — Review follow-up (code review of the finished branch)**

A code review of the branch (manual pass plus an independent reviewer agent)
found no correctness issues — the fail-open contract held at every layer
checked. Three structural findings were implemented in one follow-up commit:

- `useActionPrerequisites` now takes the prerequisites to check and only
  fetches those. Before, every consuming page fired all three reads: the
  Exam Template list fetched all active LMS setups (page_size 500) and the
  exam template names for nothing, the Exams list fetched connection
  configuration names for nothing. Out-of-scope prerequisites stay
  unresolved and therefore count as met, like every other unknown.
- `NavigationSectionItem` was split: the declaration shape keeps `requires`/
  `prerequisiteMessages`, and a `ResolvedNavigationSectionItem` (required
  `disabled` + `unmetMessages`) is what `NavigationSection` accepts — so a
  consumer that forgets to resolve prerequisites no longer typechecks.
- The tooltip message testid is now item-scoped
  (`${testId}-prerequisiteMessage-text`) like its info-button sibling; the
  global one would trip Playwright strict mode with two dead items open.
- The unmet branch got e2e coverage:
  `tests/e2e/10-action-prerequisites/unmet-prerequisites.spec.ts` empties the
  three prerequisite reads over the standard mock backend and asserts the
  three Navigation Overview items are dead spans with info buttons, the
  Prepare Exam tooltip carries both messages, and the Exams "Prepare" /
  Exam Template "Add" buttons are disabled. *(Removed again before merge —
  see the 2026-09-01 e2e cleanup comment below.)*

Verified: `vue-tsc --noEmit`, `typecheck:playwright`, eslint and prettier
clean; the new spec passes; `06-exam` suite unchanged (7 passed, 1 failure
in "row click opens the detail page" that reproduces identically on
`origin/main` served by a clean local vite — pre-existing sandbox
flakiness, not from this branch). Live against the dev server, institution
6: the Exam Template list fires only `client_configuration/names`, the
Exams list only `lms-setup/active` + `exam-template/names`, and all gated
actions render dead with their info buttons.

Skipped on purpose: moving the `Prerequisite` enum out of the composable
(layering nit, no bundle impact worth the churn) and rewording the
`useExamTemplateNames` staleTime comment.

**2026-09-01 — e2e cleanup before merge**

The e2e suite is experimental and frozen: no new specs while it is broken on
`main` (the branch goal is only to not break more of it). So the unmet-state
spec added in the review follow-up
(`tests/e2e/10-action-prerequisites/unmet-prerequisites.spec.ts`) was removed
again; the unmet branch keeps its manual verification (dev server,
institution 6) recorded above. The three prerequisite mock routes in
`tests/e2e/shared/mocks/mock-backend.ts` stay.

Evidence the mock routes are the right ones (full chromium suite against a
local vite, sandbox):

- `main` baseline: 121/173 passed.
- This branch with the mocks: 121/173 passed, failure list byte-identical
  to `main`'s.
- This branch with `main`'s mock-backend.ts: 53 failures — the same 52 plus
  `06-exam/2.2-read-get-all.spec.ts` "H add button navigates to the create
  page", because the now-gated Prepare button reads `lms-setup/active`,
  whose catch-all `{}` resolves to an empty page and disables it.
- Per-route: only `lms-setup/active` is strictly load-bearing today.
  `client_configuration/names` and `exam-template/names` pass without their
  mocks only because the catch-all `{}` fails zod parsing, so the
  prerequisite stays unresolved and `useActionPrerequisites` fails open.
  All three are kept anyway: that accident dies as soon as error states
  resolve to `[]` (e.g. the TanStack Query migration), and the mock
  institution should stay semantically "fully set up".
