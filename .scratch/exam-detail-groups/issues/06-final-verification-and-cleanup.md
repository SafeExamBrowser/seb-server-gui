# 06 — Final verification & cleanup

**What to build:** A full cross-case pass over the reworked exam detail page
plus the shared-widget consumers, and the leftover housekeeping: sweep for
i18n keys that became unused across the whole feature (grep-verified), update
the PRD status, and append the dated "Implemented" comments with verification
evidence to the issue files. No new functionality.

**Blocked by:** 05 — Screen proctoring setting in the exam's BasicSettings.

**Status:** ready-for-human

- [x] Browser sweep (dev server, super-admin/admin123): exam 11 (proctored,
      APPLY_SEB_GROUPS), exam 4 (proctoring off), exam 5 (legacy EXAM
      strategy), and a finished/archived exam (controls disabled) all behave
      per the PRD; template detail page and template wizard groups step pass
      regression (access contract absent, new default active); prepare-exam
      groups step unaffected.
- [x] No unused i18n keys remain from the removed copy flow or the reworked
      boxes; every remaining new key appears verbatim in the client source.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] PRD status updated; each issue file carries a dated "Implemented"
      comment with its verification evidence; browser-tooling artifacts from
      the sessions are deleted.

## Comments

**2026-08-25 — Implemented**

- Browser sweep in the tickets 01–05 sessions (evidence recorded per issue):
  exam 11 (SP column, fallback row, add/edit/delete + default-on flag),
  exam 4 (no column, no toggle), exam 5 (legacy EXAM — "Single Group" with
  generic fallback label), finished exam 9 (Groups controls and the SP
  toggle in BasicSettings visible but disabled). Template 54/53 detail pages
  and the template-creation wizard groups step pass regression. Prepare-exam
  wizard loads; its groups step's components are untouched by this feature
  (custom UI + unchanged helper signatures, typecheck-clean).
- i18n: scripted sweep over `examDetail.boxes.clientGroups`,
  `examDetail.boxes.basicSettings`, `clientGroups.*`,
  `screenProctoring.enabled` — every key appears in client source (the
  `clientGroups.description.*` entries are consumed via bracket syntax in
  `generalUtils.ts`, pre-existing). Copy-flow keys are gone.
- `npx vue-tsc --noEmit` clean; no unit tests per the standing project
  decision (e2e suite needs a full environment, not run).
- PRD set to ready-for-human, backend `isSPSGroup` finding recorded there
  for Andreas; `.playwright-mcp` artifacts deleted at session end.
