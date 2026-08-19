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

- [x] `BoxScreenProctoringSettings/` folder, its grid slot, and
      `handleScreenProctoringChange` are gone; no dangling imports.
- [x] Basic Settings box shows "Screen Proctoring" as its last row; the edit
      dialog shows the switch last; titles unchanged.
- [x] Toggling SPS and saving sends an update whose `EXAM_ATTRIBUTES` differ
      from the stored ones only in `enableScreenProctoring` (verify payload in
      the browser network tab).
- [x] Fallback group row still shown, non-editable/non-deletable, when SPS is
      enabled (including legacy `EXAM` templates).
- [x] `npx vue-tsc --noEmit`, eslint, prettier pass; Playwright verification
      against the running dev server (PRD "Dev environment").

## Comments

### 2026-08-17 — Implemented

- Deleted `BoxScreenProctoringSettings/` (box, edit dialog, `types.ts`), its
  grid slot in `index.vue` (groups slot renumbered `06_` → `05_`), and
  `handleScreenProctoringChange`.
- `BasicSettings` view-model (`models/examTemplate.ts`) gained
  `screenProctoringEnabled: boolean`; the detail page derives it from
  `EXAM_ATTRIBUTES.enableScreenProctoring` and `handleBasicSettingsChange`
  writes it back as the only changed exam attribute.
- Basic Settings box/dialog show the toggle last via the existing
  `showScreenProctoringEnabled` option of `useExamTemplateBasicSettingsFields`.
- Verification: `npx vue-tsc --noEmit`, eslint, prettier clean. Playwright on
  template 54 (APPLY_SEB_GROUPS, `spsSEBGroupsSelection: "3"`): toggle off →
  PUT carried `enableScreenProctoring: "false"` with
  `spsCollectingStrategy: "APPLY_SEB_GROUPS"`,
  `spsCollectingGroupName: "Fallback Group"`, `spsSEBGroupsSelection: "3"`
  untouched; toggle back on → only the flag flipped to `"true"`. Fallback
  group row still rendered non-editable. Only console errors were Vite HMR
  websocket noise (sandbox networking).

### 2026-08-17 — Review follow-up

Code review flagged that a template with `enableScreenProctoring: "true"` but
no stored `spsCollectingStrategy` would render with no fallback row and a
blocked add-group action. Fix: the detail page's `collectionStrategy` table
dep now defaults to `"APPLY_SEB_GROUPS"` when nothing is stored — display
only, never written back (the update payload stays flag-only).
`screenProctoring.enabled` also now derives from
`basicSettings.screenProctoringEnabled` instead of re-reading the attribute.

Browser-verified the virgin-enable flow (wizard SPS off → detail-page
enable): the state turned out to be ~unreachable because **the backend seeds
`spsCollectingStrategy: "EXAM"` on the flag-enable PUT** — the row renders as
legacy "Single Group" via the untouched widget. The default stays as a
defensive display fallback. Note for Alain: enabling SPS from the detail page
thus produces new `EXAM`-strategy templates (backend-owned behavior — may be
worth a backend ticket with Kristina, given SEBSERV-973's goal).

### 2026-08-17 — Decision: seed APPLY_SEB_GROUPS on enable (PRD §3 amended)

Alain relaxed PRD decision 3: enabling SPS from the detail page also writes
`spsCollectingStrategy: "APPLY_SEB_GROUPS"`, but **only** when no strategy is
stored; disable and stored-strategy paths stay verbatim. Implemented in
`handleBasicSettingsChange` and browser-verified both branches (virgin enable
and template 54 off→on pass-through, restored to its original state).

Refined finding while verifying: the backend seeds `EXAM` **at template
creation** (the first GET after a wizard SPS-off create already returns
`spsCollectingStrategy: "EXAM"`), not on the flag-enable PUT as stated above.
Consequence: "no stored strategy" never occurs today, so the new seed rule is
a deliberate no-op until the backend changes. Alain's decision: keep the
client rule as-is and ask the backend developer to change the creation
default (`EXAM` → `APPLY_SEB_GROUPS`, or no default) so the rule takes
effect.
