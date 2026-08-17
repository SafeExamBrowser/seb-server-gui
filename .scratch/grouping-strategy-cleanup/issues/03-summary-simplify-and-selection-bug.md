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

- [ ] Summary with SPS on: fallback group listed with name "Fallback Group",
      type "Screen Proctoring Fallback Group", SPS = true; per-group booleans
      match the switches set in the groups step.
- [ ] With 12+ groups where only group 11 has SPS, groups 1 and 2 show
      SPS = false on the summary.
- [ ] Summary with SPS off: no fallback group, no SPS booleans (unchanged).
- [ ] `npx vue-tsc --noEmit`, eslint, prettier pass; Playwright verification
      against the running dev server (PRD "Dev environment").

## Comments
