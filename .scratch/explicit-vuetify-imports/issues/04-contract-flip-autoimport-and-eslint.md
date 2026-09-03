# 04 — Contract: disable auto-import, remove the ESLint exemption

**What to build:** The end state of the migration. Vuetify's build-time auto-import is switched off (`autoImport: false`; the plugin stays for styles handling and asset URL transforms), and the `ignorePatterns: ["^V[A-Z]"]` exemption is removed from the `vue/no-undef-components` ESLint rule. From here on, one uniform rule governs every component in every template — Vuetify or not: if a tag is used, it is imported, and a forgotten import fails lint at pre-commit and in CI. These two changes land together in one commit, since each is only correct in the presence of the other.

Verification runs all three seams from the PRD:

1. Full lint run — the completeness proof that every Vuetify tag has an explicit import.
2. `vue-tsc --noEmit` — every imported name is a real export.
3. Playwright smoke test against the running dev server — walk the main views (login, dashboard, exam views, and the dialogs using the stepper, color input, file upload, and date input) and assert no "Failed to resolve component" console warnings. This covers the runtime failure mode that lint and types structurally cannot see.

**Blocked by:** 01, 02, 03.

**Status:** done

- [x] `autoImport` disabled; `vite-plugin-vuetify` retained for styles and asset URL transforms
- [x] `vue/no-undef-components` has no Vuetify exemption
- [x] Negative check: temporarily deleting one Vuetify import makes lint fail, restoring it makes lint pass
- [x] Full lint run green; `vue-tsc --noEmit` green; production build succeeds
- [x] Playwright smoke test of main views clean — no component-resolution console warnings, formerly global components render correctly

---

**Implemented** (2026-08-04)

- `vite.config.mts`: `autoImport: false`; plugin retained (styles + `transformAssetUrls`). `eslint.config.js`: `vue/no-undef-components` is now a plain `"error"` — the `ignorePatterns: ["^V[A-Z]"]` option and its justifying comment removed.
- Negative check: deleting the `VApp` import from `App.vue` → lint fails with `The '<v-app>' component has been used, but not defined`; restoring it → lint passes.
- `lint:check:all` exit 0; `npm run build` (vue-tsc + vite build) exit 0.
- Browser smoke test on the dev server, confirmed restarted with the new config (dep-optimizer configHash rewritten immediately after the edit; vite client token changed mid-session): login page, navigation overview, exam list, exam detail (id 2), exam create wizard (vertical stepper, assessment-tool select, StepQuiz with working VDateInput calendar popup), exam-template create wizard (stepper), `/institution/create` (VFileUpload drop zone), edit-indicator dialog on template 14 (VColorInput fields). Zero Vue "Failed to resolve component" warnings across the session; only sandbox HMR-websocket noise and pre-login oauth 400s.
