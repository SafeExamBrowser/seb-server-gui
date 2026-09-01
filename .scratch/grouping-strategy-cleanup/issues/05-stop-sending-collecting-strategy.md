# 05 — Stop sending spsCollectingStrategy from the client

Status: done
Settled 2026-08-18 in a grilling session with Alain.

## Context

The backend ticket anticipated in PRD decision #3 landed: the backend now
**persists** `spsCollectingStrategy: "APPLY_SEB_GROUPS"` at template creation
when the request carries no strategy (previously it seeded the legacy `EXAM`
default). GET therefore never returns an absent or `EXAM`-defaulted strategy
for newly created templates. Alain's local backend has the fix.

With the backend owning the default, the two remaining client-side strategy
writes are dead weight:

1. Wizard: `buildScreenProctoringExamAttributes` hardcoded
   `spsCollectingStrategy: "APPLY_SEB_GROUPS"` when SPS is enabled.
2. Detail page: the `seedStrategy` block in `handleBasicSettingsChange`
   wrote `APPLY_SEB_GROUPS` when enabling SPS on a template with no stored
   strategy (an explicit interim exception in PRD decision #3).

## Changes

- `client/src/models/seb-server/screenProctoring.ts`:
  `buildScreenProctoringExamAttributes` drops `spsCollectingStrategy` from
  both branches; `ScreenProctoringExamAttributes` Pick narrowed accordingly.
  `spsCollectingGroupName` is **still sent** — the backend does not default it.
- `client/src/pages/(app)/exam-template/[id]/composables/useExamTemplateDetailPage.ts`:
  delete the `seedStrategy` const, conditional spread, and its comment.
  `handleBasicSettingsChange` is a pure pass-through of stored
  `EXAM_ATTRIBUTES` plus the `enableScreenProctoring` flag.
- The read-side fallback (`?? "APPLY_SEB_GROUPS"` in the `collectionStrategy`
  computed) **stays** — it mirrors the backend's read-side semantics, keeps
  the type narrow, and guards any pre-seeding legacy row.
- PRD amendments (decisions #3, #9, verification section) + ticket-number
  sweep 968 → 973 across `.scratch` prose.

## Out of scope

- Legacy `EXAM` templates keep rendering unchanged (existing read paths).
- Generated API types, backend, shared `clientGroupsTable` widget.

---

**2026-08-18 — Implemented.** Verification against Alain's running dev server
(vite on :8082, updated local backend), Playwright MCP, login super-admin:

- `npx vue-tsc --noEmit` clean; eslint clean on both changed files.
- Wizard, SPS on ("SPS 973 Verify A", one group with SPS + fallback row shown):
  create payload `EXAM_ATTRIBUTES` was `{enableScreenProctoring: "true",
  spsCollectingGroupName: "Fallback Group", spsSEBGroupsSelection: "0"}` —
  **no `spsCollectingStrategy`**; first GET returned
  `spsCollectingStrategy: "APPLY_SEB_GROUPS"` (backend-persisted default).
- Original-bug regression ("SPS 973 Verify B", SPS off): create payload sent
  only `{enableScreenProctoring: "false"}`; first GET already returned
  `APPLY_SEB_GROUPS` (not `EXAM`). Enabling SPS from the detail page put
  through the stored strategy verbatim (`APPLY_SEB_GROUPS`) with no seeding
  logic; re-GET consistent.
- Legacy `EXAM` pass-through (template 14 "Alain Indicator Tests",
  stored strategy `EXAM`, SPS off): enabling SPS sent
  `{enableScreenProctoring: "true", spsCollectingStrategy: "EXAM"}` —
  `EXAM` untouched, no rewrite to `APPLY_SEB_GROUPS`; disabling again
  restored the original state (`EXAM` still stored, SPS off).
- Test templates 84/85 deleted via API; `.playwright-mcp` artifacts removed.
