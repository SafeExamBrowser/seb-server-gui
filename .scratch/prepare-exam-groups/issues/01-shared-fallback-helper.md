# 01 — Shared fallback-group helper (prefactor)

**What to build:** One shared, pure implementation of "which Screen Proctoring
Fallback Group applies" lives in the client-group utility module, and the
shared client-groups table widget consumes it. The helper derives the fallback
group from screen-proctoring enablement, collecting strategy, and the stored
group name: it exists iff screen proctoring is enabled; the legacy
"one group for exam" strategy yields the single-group variant, everything else
the fallback variant; the name falls back to the existing i18n defaults. The
synthetic fallback type and its sentinel id move into the same module. This is
a pure refactor — no user-visible change anywhere.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A pure helper in the client-group utility module returns the fallback
      group (or nothing) from enablement + strategy + name; the synthetic
      fallback type and sentinel id live beside it.
- [x] The shared client-groups table widget derives its fallback row through
      the helper; no second implementation of the rules remains in it.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [x] Browser regression (dev server, super-admin/admin123): exam template
      detail page of template 54 "Alain ClientGroups Test" still shows the
      "Fallback Group" row (not editable/deletable); the template creation
      wizard's groups step still shows the fallback row when screen proctoring
      is on in step 1; a legacy "one group for exam" template (e.g. template
      65 "Test: sp enabled but groupingstrategy enforced") still renders its
      single-group variant.

---

**Implemented** (2026-08-24, commits `4ff8505f` + review-fixes `c2ca8bf1`)

`getScreenProctoringFallbackGroup` (pure, args → `ClientGroupFallback |
undefined`), the `SCREEN_PROCTORING_FALLBACK_ROW_ID` sentinel, the
`ClientGroupFallback` type and `FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS` now live
in `client/src/utils/clientGroup.ts`; `useTable.ts` consumes the helper and
`types.ts` spreads the shared label keys. The review-fixes commit added the
`getScreenProctoringFallbackGroupForTemplate` wrapper (exam-attributes →
helper, strategy narrowed via `SCREEN_PROCTORING_COLLECTION_STRATEGY`) and an
`||` name fallback so an empty stored name renders the i18n default.

Verification (Playwright against dev, 2026-08-24):
- Template 54 detail page: "Fallback Group" / "Screen Proctoring Fallback
  Group" row rendered with an empty actions cell (asdf/asdf2 keep
  edit/delete).
- Template creation wizard, SP enabled in step 1: groups step shows the
  fallback row (no actions).
- Legacy variant: template **64** "Test: sp enabled but groupingstrategy
  chill" (its `spsCollectingStrategy` is `EXAM`; the fixture note above named
  template 65, but 65's stored strategy is actually `APPLY_SEB_GROUPS` — both
  its EXAM_ATTRIBUTES and its screen-proctoring settings endpoint agree, so 65
  correctly renders the fallback variant). Template 64's detail page shows
  "Single Group" / "Screen Proctoring Single Group", not editable.
