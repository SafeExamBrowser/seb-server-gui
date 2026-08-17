# 02 — Wizard: remove the grouping-strategy choice

Status: ready-for-agent
Parent: `.scratch/grouping-strategy-cleanup/PRD.md` (decisions 5–10, Background)
Blocked by: 01 — Detail page: merge SPS toggle into Basic Settings.

## What to build

In the exam-template creation wizard the grouping strategy is no longer a
choice. The client-group step shows only the groups table (no dropdown, no
"screen proctoring" section subtitle) and its Next button is always enabled —
the "at least one SPS group" restriction is permanently gone, including the
temporary-hack comment block in `useStepClientGroupStore`. Per-group SPS
switches keep being gated by the step-1 Screen Proctoring flag.

On submit, a template with SPS enabled always carries
`spsCollectingStrategy: "APPLY_SEB_GROUPS"` and the i18n "Fallback Group" name;
with SPS disabled, attributes are stripped as today. The shared
`clientGroupsTable` widget stays untouched — the wizard feeds it a constant
`"APPLY_SEB_GROUPS"` strategy dep. `useScreenProctoringStrategyField.ts` is now
consumer-free and gets deleted.

## Acceptance

- [x] `ScreenProctoringForm.vue` and `useScreenProctoringStrategyField.ts`
      deleted; `collectionStrategy` gone from `useScreenProctoringStore`;
      `isReady`/`isScreenProctoringFormReady` gone from
      `useStepClientGroupStore` (step always ready); hack block deleted.
- [x] `buildScreenProctoringExamAttributes` has no strategy parameter and is
      wizard-only.
- [x] Groups step shows just the table; per-group SPS switch only when the
      step-1 flag is on; fallback group row present with SPS on.
- [x] Create request payload carries `spsCollectingStrategy: "APPLY_SEB_GROUPS"`
      when SPS is on (browser network tab); nothing SPS-related when off.
- [x] `npx vue-tsc --noEmit`, eslint, prettier pass; Playwright verification
      against the running dev server (PRD "Dev environment").

## Comments

### 2026-08-17 — Implemented

- Deleted `ScreenProctoringForm.vue` (and its now-empty `components/` folder)
  and `useScreenProctoringStrategyField.ts`.
- `useScreenProctoringStore` is down to `enabled` + `$reset`;
  `useStepClientGroupStore` lost `isScreenProctoringFormReady`/`isReady` and
  the commented-out temporary-hack block; `isStepReady` returns `true` for
  `StepClientGroup` (its store param dropped).
- `buildScreenProctoringExamAttributes(enabled: boolean)` hardcodes
  `APPLY_SEB_GROUPS` + i18n "Fallback Group" when enabled; disabled branch
  unchanged. `spsSEBGroupsSelection` is now gated on `enabled` directly.
- `stepClientGroup.vue` feeds the untouched `clientGroupsTable` a constant
  `"APPLY_SEB_GROUPS"` collection-strategy dep.
- Verification: `npx vue-tsc --noEmit`, eslint, prettier clean. Playwright:
  wizard with SPS on shows only the groups table (no dropdown/subtitle), Next
  enabled with zero groups, per-group SPS switch present, fallback row shown.
  Created "SPS Cleanup Verify 968" (Group A SPS on, Group B off) → POST
  `exam-template/create` carried `enableScreenProctoring: "true"`,
  `spsCollectingStrategy: "APPLY_SEB_GROUPS"`,
  `spsCollectingGroupName: "Fallback Group"`, `spsSEBGroupsSelection: "0"`.
  SPS-off path is the code-unchanged disabled branch of the builder.
