# 02 — Convert pages/

**What to build:** Every Vuetify-using SFC under `pages/` (roughly 76 files) explicitly imports the Vuetify components its template uses, same pattern as ticket 01: named imports from `vuetify/components` in `<script setup>`, kebab-case template tags kept. Reuse the codemod persisted under `.scratch/explicit-vuetify-imports/` by ticket 01, then run the autofix pipeline and review the diff.

After this ticket, every Vuetify tag in the entire codebase has an explicit import — only the ESLint exemption (removed in ticket 04) still tolerates files that lack them.

**Blocked by:** 01 — Codemod + convert components/, App.vue, utils/ (reuses its codemod).

**Status:** done

- [x] All Vuetify-using SFCs under `pages/` have explicit `vuetify/components` imports covering every Vuetify tag in their template
- [x] Templates unchanged (kebab-case tags kept); only script blocks touched
- [x] Full lint run green; `vue-tsc --noEmit` green
- [x] No behavior change expected or observed (auto-import still on)

---

**Implemented** (2026-08-04)

- Reused `.scratch/explicit-vuetify-imports/codemod.mjs`: `node ../.scratch/explicit-vuetify-imports/codemod.mjs src/pages` from `client/`, then `lint:fix:all` + `prettier:fix:all`.
- 76 of 116 SFCs under `pages/` changed, 55 distinct components, no unknown tags. The diff's single deleted line is `StepQuiz.vue`'s old one-name import that got extended; no page needed a script block added.
- Completeness probe: re-running the codemod over the whole codebase (`src/pages src/components src/utils src/App.vue`) reports 0 changes — every Vuetify tag in the client now has an explicit import.
- Verification: `lint:check:all` exit 0, `vue-tsc --noEmit` exit 0.
