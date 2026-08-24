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

**Status:** ready-for-agent

- [ ] A pure helper in the client-group utility module returns the fallback
      group (or nothing) from enablement + strategy + name; the synthetic
      fallback type and sentinel id live beside it.
- [ ] The shared client-groups table widget derives its fallback row through
      the helper; no second implementation of the rules remains in it.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
- [ ] Browser regression (dev server, super-admin/admin123): exam template
      detail page of template 54 "Alain ClientGroups Test" still shows the
      "Fallback Group" row (not editable/deletable); the template creation
      wizard's groups step still shows the fallback row when screen proctoring
      is on in step 1; a legacy "one group for exam" template (e.g. template
      65 "Test: sp enabled but groupingstrategy enforced") still renders its
      single-group variant.
