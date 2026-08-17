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

- [ ] Each removed key has zero references under `client/src` (grep); each
      kept key still has at least one verbatim reference.
- [ ] `npx vue-tsc --noEmit`, eslint, prettier pass.
- [ ] Playwright end-to-end: wizard create with SPS on (no dropdown, always-
      enabled Next, correct summary, `APPLY_SEB_GROUPS` in the payload) and
      detail page (toggle in Basic Settings, flag-only patch, fallback row) —
      per PRD "Dev environment"; no missing-translation warnings in the
      browser console.
- [ ] `.playwright-mcp/*` artifacts deleted.

## Comments
