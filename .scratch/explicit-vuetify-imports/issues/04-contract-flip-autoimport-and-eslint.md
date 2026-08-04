# 04 — Contract: disable auto-import, remove the ESLint exemption

**What to build:** The end state of the migration. Vuetify's build-time auto-import is switched off (`autoImport: false`; the plugin stays for styles handling and asset URL transforms), and the `ignorePatterns: ["^V[A-Z]"]` exemption is removed from the `vue/no-undef-components` ESLint rule. From here on, one uniform rule governs every component in every template — Vuetify or not: if a tag is used, it is imported, and a forgotten import fails lint at pre-commit and in CI. These two changes land together in one commit, since each is only correct in the presence of the other.

Verification runs all three seams from the PRD:

1. Full lint run — the completeness proof that every Vuetify tag has an explicit import.
2. `vue-tsc --noEmit` — every imported name is a real export.
3. Playwright smoke test against the running dev server — walk the main views (login, dashboard, exam views, and the dialogs using the stepper, color input, file upload, and date input) and assert no "Failed to resolve component" console warnings. This covers the runtime failure mode that lint and types structurally cannot see.

**Blocked by:** 01, 02, 03.

**Status:** ready-for-agent

- [ ] `autoImport` disabled; `vite-plugin-vuetify` retained for styles and asset URL transforms
- [ ] `vue/no-undef-components` has no Vuetify exemption
- [ ] Negative check: temporarily deleting one Vuetify import makes lint fail, restoring it makes lint pass
- [ ] Full lint run green; `vue-tsc --noEmit` green; production build succeeds
- [ ] Playwright smoke test of main views clean — no component-resolution console warnings, formerly global components render correctly
