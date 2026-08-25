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

**2026-08-25 — Code review of the whole PR**

Two code-review agents (widget/groups-box lens and BasicSettings/services
lens) reviewed the full feature diff. Accepted findings landed as four
follow-up commits:

1. Exam groups adapter: wire rows of type `SP_FALLBACK_GROUP` are excluded
   explicitly (the widget renders its own synthetic fallback row; the
   monitoring API demonstrably returns such rows, and they'd otherwise hit
   the invalid-row warning), and the full-entity group PUT now carries over
   wire-only fields (`color`, `icon`) the strict schema strips — previously
   lost on first edit.
2. The Groups box only shows the loading/error fallback on the initial
   load; background refetches after a mutation no longer unmount the table
   (and a failed background refetch no longer permanently replaces it). The
   silent exam refresh now notifies on failure instead of leaving stale
   state without signal.
3. Toggling screen proctoring refreshes the groups list (backend rewrites
   group flags — latent until the backend honors `isSPSGroup`), and a
   failed exam update now notifies and skips the activation call instead of
   silently proceeding (`updateExam` returns the updated exam or
   undefined).
4. Cleanups: `ClientGroupsTableDeps.access` reuses `CrudTableAccess`;
   `useBasicSettings` derives the SP flag via `getScreenProctoringForExam`;
   small signature polish (`Ref` instead of `ComputedRef`, exam id passed
   as mutation argument).

Declined: replacing the PRD-mandated post-activation exam refetch with the
activation response (PRD decision stands), dropping the invalid-row console
warning (PRD decision stands), and destructure-style churn in
`BoxBasicSettings`. Re-verified in the browser after the fixes: exam 11
groups render, edit PUT round-trips, SP toggle off/on triggers the new
groups refetch (network log), template 54 unchanged. Typecheck clean.

### 2026-08-25 — Pre-merge two-axis code review (whole branch vs. origin/main)

Standards + spec sub-agent review before merging the branch. Cleanups applied
(two commits):

- Dropped the inert `collectionStrategy !== "APPLY_SEB_GROUPS"` guard in
  `useClientGroupsBox.applyScreenProctoringGroups` plus its comment — the
  strategy is a client-side constant, `enabled` is the whole guard. Reverses
  the earlier "keep as future-proofing" call in favour of honest code.
- `examService.applyScreenProctoringGroups` now takes `groupIds: number[]`
  and owns the comma-joined wire format.
- Actions-column hiding consolidated into one mechanism: `CrudTable` filters
  the `actions` header off `config.headers` when `access.hidden`; the
  duplicate branch in `clientGroupsTable/useTable` and the unreachable
  `hidden` prop on `CrudActions` are gone.
- Removed two narrating comments (activation-endpoint note in
  `useBasicSettings`, watch parenthetical in `useClientGroupsBox`).

Deliberately kept: `updateExam` failure notify for all callers (ticket 06
review fix), delete-path dedicated error (ticket 07 deviation, documented),
the backend-fact comments, `screenProctoring` ref re-wrapping in tableDeps.

Verification: eslint, prettier, vue-tsc, vite build all clean. Browser
(dev server, super-admin): exam 4 SP toggle on → PUT + activation + exam &
groups refetch, SP column + fallback row appear; create "Review Test Group"
(SP default-on) → `apply-groups?spsSEBGroupsSelection=54`; edit toggle →
PUT + apply-groups; exam 11 "Manual Gropu" toggle on/off →
`…=43` / blank, `isSPSGroup` round-trips and column updates in place;
delete unflagged group → DELETE only, no apply-groups; SP toggle off
restores plain table. Note: on exam 4 (SP freshly enabled) the backend kept
`isSPSGroup=false` despite 200 on apply-groups — same wire calls succeed on
exam 11, so this looks like an SPS-side init quirk on freshly activated
exams, not a client issue. Test data cleaned up on both exams.
