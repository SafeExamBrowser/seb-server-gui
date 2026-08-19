# 03 — Summary: simplify strategy handling + fix group-selection substring bug

Status: ready-for-agent
Parent: `.scratch/grouping-strategy-cleanup/PRD.md` (decisions 11–13)
Blocked by: 02 — Wizard: remove the grouping-strategy choice.

## What to build

The wizard summary reflects the fixed strategy: the synthetic fallback-group
entry is always typed with the `SCREEN_PROCTORING_FALLBACK` label (the `EXAM`
branch, `notFoundValue` fallback and its TODO in `getSummaryClientGroups.ts`
go away), and the per-group Screen Proctoring booleans no longer check the
strategy — only that SPS is enabled and a selection exists.

Bug fix in the same lines: group membership in `spsSEBGroupsSelection` must be
an exact match (`.split(",").includes(...)`), not a substring `includes` —
today group 1 shows as SPS-enabled whenever group 11 is selected.

## Acceptance

- [x] Summary with SPS on: fallback group listed with name "Fallback Group",
      type "Screen Proctoring Fallback Group", SPS = true; per-group booleans
      match the switches set in the groups step.
- [x] With 12+ groups where only group 11 has SPS, groups 1 and 2 show
      SPS = false on the summary.
- [x] Summary with SPS off: no fallback group, no SPS booleans (unchanged).
- [x] `npx vue-tsc --noEmit`, eslint, prettier pass; Playwright verification
      against the running dev server (PRD "Dev environment").

## Comments

### 2026-08-17 — Implemented

- `getSummaryClientGroups.ts`: per-group SPS boolean no longer checks
  `spsCollectingStrategy`; membership uses exact matching via
  `.split(",").includes(...)`. `getFallbackGroupTypeValue()` deleted — the
  fallback entry's type is always the `SCREEN_PROCTORING_FALLBACK` label
  (`EXAM` branch, `notFoundValue` fallback and TODO removed).
- Verification: `npx vue-tsc --noEmit`, eslint, prettier clean. Playwright
  (drafts not saved): wizard with SPS on and 11 groups where only G11
  (index 10, selection `"10"`) has SPS → summary shows G11 = Yes and
  G01/G02 = No (previously substring-matched to Yes); fallback entry named
  "Fallback Group", typed "Screen Proctoring Fallback Group", SPS = Yes.
  With SPS off: no per-group SPS switch, no fallback row/entry, no SPS
  booleans on the summary.

### 2026-08-17 — Review follow-up

Code review caught a pre-existing guard bug on the touched lines: with SPS on
and **zero** groups selected, `spsSEBGroupsSelection` is the empty string
(falsy), so the per-group SPS booleans vanished from the summary instead of
showing "No". The guard now tests `!== undefined` — booleans render "No" for
every group in that case; SPS off (selection `undefined`) still renders none.
