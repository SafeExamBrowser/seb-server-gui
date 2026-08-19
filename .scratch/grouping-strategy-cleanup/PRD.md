# PRD: Remove the EXAM grouping strategy from the client (SEBSERV-973)

Branch: `SEBSERV-973__exam-template-cleanups`
Settled 2026-08-17 in a grilling session with Alain — don't relitigate the
decisions below; ask only if the code contradicts them.

*Ticket-number correction 2026-08-18:* this work was mislabeled SEBSERV-968
at first; the correct ticket has always been SEBSERV-973. Prose references
are fixed, but the already-pushed commits `a6ce5a66`, `27f1d472`, `10516ba6`
keep their `#968:` prefixes (no history rewrite); later commits say `#973`.
Historical artifact names ("SPS Cleanup Verify 968" etc.) stay verbatim.

*Amended 2026-08-18 (issue 05):* the backend ticket referenced in decision #3
landed — the backend now persists `APPLY_SEB_GROUPS` at template creation when
no strategy is sent. The client no longer writes `spsCollectingStrategy` at
all; decisions #3 and #9 are updated accordingly below.

## Goal

The client must no longer **create or write** the `EXAM` ("One Group for Exam")
screen-proctoring grouping strategy. `APPLY_SEB_GROUPS` is the only strategy the
exam-template wizard sends. **Reading/displaying** legacy `EXAM` templates keeps
working unchanged; any data migration is backend-owned — the frontend never
triggers it (Kristina confirmed the backend handles this).

The step-1 "Screen Proctoring" flag keeps its gating role exactly as today:
with SPS off there is no strategy, no fallback group, and no per-group SPS flag.

## Background

- The "at least one group with SPS enabled" restriction for `APPLY_SEB_GROUPS`
  is permanently gone (Kristina confirmed). A temporary hack — the commented-out
  block + `TODO @alain` in
  `client/src/pages/(app)/exam-template/create/components/stepClientGroup/composables/store/useStepClientGroupStore.ts`
  (from commit `fff14102`, SEBSERV-958) — must be **deleted**, not re-enabled.
- The grouping strategy becomes invisible to users everywhere; the enum value
  `EXAM` survives only in read paths for legacy data.

## Decision record

### Detail page (`client/src/pages/(app)/exam-template/[id]/`)

1. Delete the whole `components/BoxScreenProctoringSettings/` folder (box,
   `ScreenProctoringEditDialog.vue`, `types.ts`) and its grid slot in
   `index.vue`; delete `handleScreenProctoringChange` from
   `composables/useExamTemplateDetailPage.ts`.
2. The SPS toggle moves into the Basic Settings box: a boolean row in the
   key-value list and a switch in the edit dialog, both **last** (after
   "Institutional Default"), via the already-supported
   `showScreenProctoringEnabled` option of
   `useExamTemplateBasicSettingsFields` (same as wizard step 1). Box/dialog
   titles unchanged.
3. Data flow: extend the detail page's `BasicSettings` view-model with
   `screenProctoringEnabled: boolean`; `handleBasicSettingsChange` translates it
   into `EXAM_ATTRIBUTES: { ...existing, enableScreenProctoring: "true"|"false" }`.
   **The flag is the only attribute the detail page ever changes** —
   `spsCollectingStrategy` and `spsCollectingGroupName` pass through verbatim,
   even when toggling off/on on a legacy `EXAM` template. Deliberate behavior
   change: disabling no longer clears strategy/group name.
   *Amended 2026-08-17 (Alain), retired 2026-08-18:* the interim
   seed-on-enable exception (write `APPLY_SEB_GROUPS` when no strategy is
   stored) existed only to bridge the backend's legacy `EXAM` default. The
   backend fix landed (persists `APPLY_SEB_GROUPS` at creation), so the seed
   block is deleted — pass-through is unconditional again (issue 05).
4. The fallback-group row in the groups table already works (client-side
   synthetic, not editable/deletable, renders the `EXAM` variant for legacy
   templates) — no change.

### Wizard (`client/src/pages/(app)/exam-template/create/`)

5. Delete `components/stepClientGroup/components/ScreenProctoringForm.vue`
   (the strategy dropdown + section subtitle were its only content). The
   client-group step renders just the groups table; per-group SPS switches stay
   gated by the step-1 flag as today.
6. Delete `client/src/composables/useScreenProctoringStrategyField.ts` once
   both consumers (wizard form, detail dialog) are gone.
7. `useScreenProctoringStore`: remove `collectionStrategy`;
   `screenProctoringAllowedForGroups` collapses to `enabled`.
8. `useStepClientGroupStore`: remove `isScreenProctoringFormReady` and
   `isReady` — the step is **always ready** (no validation left; groups remain
   optional with SPS on or off). Delete the temporary-hack comment block.
9. Submit: `buildScreenProctoringExamAttributes`
   (`client/src/models/seb-server/screenProctoring.ts`) loses its
   `collectionStrategy` parameter and, when enabled, sends
   `spsCollectingGroupName: i18n "Fallback Group"`. Disabled behavior
   unchanged (`enableScreenProctoring: "false"`, name stripped).
   The builder becomes wizard-only.
   *Amended 2026-08-18 (issue 05):* `spsCollectingStrategy` is no longer sent
   at all — the backend persists the `APPLY_SEB_GROUPS` default itself. The
   group name is still client-sent (the backend does not default it).
10. The wizard passes a constant `"APPLY_SEB_GROUPS"` as the
    `collectionStrategy` table dep so the shared `clientGroupsTable` widget
    stays **untouched**.

### Summary step (`.../create/components/stepSummary/`)

11. Per-group SPS boolean: drop the
    `spsCollectingStrategy === "APPLY_SEB_GROUPS"` condition (always true when
    SPS is enabled).
12. `getFallbackGroupTypeValue()` in `getSummaryClientGroups.ts` collapses to
    always return the `SCREEN_PROCTORING_FALLBACK` label; delete the `EXAM`
    branch, the `notFoundValue` fallback and its TODO. The fallback-group entry
    itself stays.
13. **Bug fix (in scope):** the per-group membership check
    `spsSEBGroupsSelection.includes(clientGroupIndex.toString())` is a
    substring match (group 1 lights up if group 11 is selected). Use exact
    membership: `.split(",").includes(...)`.

### i18n (`client/src/i18n/locales/en.json`; de.json is a stub — nothing there)

14. Delete: all six `screenProctoring.collectionStrategy.*` keys (`label`,
    `placeholder`, `info.EXAM`, `info.APPLY_SEB_GROUPS`, `strategies.EXAM`,
    `strategies.APPLY_SEB_GROUPS`),
    `createTemplateExam.steps.clientGroup.subtitleScreenProctoring`,
    `examTemplateDetail.boxes.screenProctoringSettings.title` + `.dialogTitle`.
15. Keep (still used): `screenProctoring.enabled.label`,
    `clientGroups.screenProctoringSingleGroupName` +
    `screenProctoringFallbackGroupName`, the
    `SCREEN_PROCTORING_SINGLE`/`SCREEN_PROCTORING_FALLBACK` type labels,
    `createTemplateExam.steps.summary.notFoundValue` (other consumers).

## Out of scope

- Shared `clientGroupsTable` widget (keeps its `EXAM` branch,
  `SCREEN_PROCTORING_SINGLE` type and `isScreenProctoringAllowedForGroups`
  helper for legacy display).
- `SCREEN_PROCTORING_COLLECTION_STRATEGY` enum keeps both values (read paths).
- Exam-create wizard (`spsSEBGroupsSelection` reader), monitoring pages,
  generated API types/OpenAPI, backend.

## Process

- Work the issues in order (linear chain). The implementing agent **may commit**
  per sensible slice; Alain reviews everything at the end. Never push.
- No unit tests (project decision) — verify via typecheck + browser.
- Append a dated "Implemented" comment with verification evidence to each
  issue file when done.

## Dev environment / verification

- `cd client && npx vue-tsc --noEmit`; eslint/prettier per package scripts.
- Browser-verify with Playwright MCP against Alain's **already-running** dev
  server — never start the DB, backend, or containers. Login
  `super-admin` / `admin123`.
- Wizard: create a template with SPS on → no strategy dropdown on the groups
  step, Next always enabled, summary shows the fallback group typed
  "Screen Proctoring Fallback Group"; the create request payload carries
  `spsCollectingGroupName` but **no** `spsCollectingStrategy` (check via
  network tab); the first GET returns `APPLY_SEB_GROUPS` (backend default).
  *(Amended 2026-08-18 — the payload previously had to carry the strategy.)*
- Detail page: no Screen Proctoring Settings box; toggle sits last in Basic
  Settings; saving flips only `enableScreenProctoring` in the update payload.
- Delete any `.playwright-mcp/*` artifacts before ending the turn.
