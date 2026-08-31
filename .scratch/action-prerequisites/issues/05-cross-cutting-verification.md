# 05 — Cross-cutting verification

**What to build:** No new behaviour. The checks that no single slice can
cover on its own, run against the finished feature, plus a clear record of
what was left behind on the dev server.

**Blocked by:** 02, 03, 04.

**Status:** ready-for-agent

- [ ] The failed-request path is verified with stubbed responses — the only
      state that cannot be produced from real data. Every gated action stays
      live and no message appears when a prerequisite check fails.
- [ ] A fully populated institution is verified end to end: the Navigation
      Overview, the Exams list and the Exam Template list show no change
      whatsoever from before this feature.
- [ ] The info button is verified reachable and readable by keyboard alone —
      it is the only focusable element on a dead item — and by tap on a touch
      viewport.
- [ ] No gated action ever flashes from live to dead on a cold page load in
      an institution where the prerequisites are unmet.
- [ ] Typecheck passes across the finished feature (`npx vue-tsc --noEmit` in
      `client/`).
- [ ] What was left in institution 6 is reported: the account created, and
      which entities were removed or deactivated. No restoration is required
      — institution 6 is disposable test data, exam 17 included.
- [ ] Any follow-up worth filing is named, in particular the wizard-step
      empty state that would replace a route guard for bookmarked deep links,
      and the outcome of the connection configuration active-filter question
      from ticket 01 if it turned out the filter is ignored.
