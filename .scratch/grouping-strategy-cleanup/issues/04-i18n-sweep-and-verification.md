# 04 — i18n sweep + full verification

Status: ready-for-agent
Parent: `.scratch/grouping-strategy-cleanup/PRD.md` (decisions 14–15, Dev environment)
Blocked by: 01, 02, 03.

## What to build

Remove the translation keys orphaned by the previous issues from `en.json`
(de.json is a stub): all six `screenProctoring.collectionStrategy.*` keys,
`createTemplateExam.steps.clientGroup.subtitleScreenProctoring`, and
`examTemplateDetail.boxes.screenProctoringSettings.title` + `.dialogTitle`.
Keys used by legacy display stay (PRD decision 15). Then run the full
verification pass over both flows as the finishing gate for the feature.

## Acceptance

- [x] Each removed key has zero references under `client/src` (grep); each
      kept key still has at least one verbatim reference.
- [x] `npx vue-tsc --noEmit`, eslint, prettier pass.
- [x] Playwright end-to-end: wizard create with SPS on (no dropdown, always-
      enabled Next, correct summary, `APPLY_SEB_GROUPS` in the payload) and
      detail page (toggle in Basic Settings, flag-only patch, fallback row) —
      per PRD "Dev environment"; no missing-translation warnings in the
      browser console.
- [x] `.playwright-mcp/*` artifacts deleted.

## Comments

### 2026-08-17 — Implemented

- Removed from `en.json`: the whole `screenProctoring.collectionStrategy`
  block (all six keys), `createTemplateExam.steps.clientGroup.subtitleScreenProctoring`,
  and the `examTemplateDetail.boxes.screenProctoringSettings` block
  (`title` + `dialogTitle`). Grep: zero string-literal references remain
  (the only `collectionStrategy` hits are the shared table dep property);
  every kept key from PRD decision 15 still has 1–3 referencing files.
- `npx vue-tsc --noEmit` and `npm run format:check:all` clean.
- Playwright e2e ("SPS E2E Final 968", deleted after the run along with
  "SPS Cleanup Verify 968"): wizard with SPS on — no dropdown/subtitle,
  Next enabled with zero groups, summary showed E2E-A = Yes, E2E-B = No,
  fallback entry typed "Screen Proctoring Fallback Group"; create payload
  carried `APPLY_SEB_GROUPS` + "Fallback Group" + selection "0". Detail
  page — no SPS box, "Screen Proctoring" last in the Basic Settings list
  and edit dialog, fallback row without action buttons, toggle-off PUT
  changed only `enableScreenProctoring` (strategy/name/selection verbatim).
  Zero console warnings; only errors are Vite HMR websocket noise from the
  sandbox setup.
