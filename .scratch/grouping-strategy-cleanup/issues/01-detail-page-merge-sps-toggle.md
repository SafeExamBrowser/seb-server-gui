# 01 — Detail page: merge SPS toggle into Basic Settings

Status: ready-for-agent
Parent: `.scratch/grouping-strategy-cleanup/PRD.md` (decisions 1–4)
Blocked by: None — can start immediately.

## What to build

On the exam-template detail page the separate "Screen Proctoring Settings" box
disappears. The Screen Proctoring on/off toggle lives in the Basic Settings box
instead: shown as the last row of its key-value list and as the last field
(switch) in its edit dialog. Saving the dialog updates **only** the
`enableScreenProctoring` exam attribute — stored `spsCollectingStrategy` and
`spsCollectingGroupName` pass through verbatim (no clearing on disable, no
rewriting on enable; migration is backend-owned). Legacy `EXAM` templates keep
rendering their fallback group row in the groups table exactly as before.

This removes one of the two consumers of `useScreenProctoringStrategyField.ts`
and the detail page's use of `buildScreenProctoringExamAttributes`, unblocking
issue 02.

## Acceptance

- [ ] `BoxScreenProctoringSettings/` folder, its grid slot, and
      `handleScreenProctoringChange` are gone; no dangling imports.
- [ ] Basic Settings box shows "Screen Proctoring" as its last row; the edit
      dialog shows the switch last; titles unchanged.
- [ ] Toggling SPS and saving sends an update whose `EXAM_ATTRIBUTES` differ
      from the stored ones only in `enableScreenProctoring` (verify payload in
      the browser network tab).
- [ ] Fallback group row still shown, non-editable/non-deletable, when SPS is
      enabled (including legacy `EXAM` templates).
- [ ] `npx vue-tsc --noEmit`, eslint, prettier pass; Playwright verification
      against the running dev server (PRD "Dev environment").

## Comments
