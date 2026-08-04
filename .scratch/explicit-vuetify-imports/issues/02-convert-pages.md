# 02 — Convert pages/

**What to build:** Every Vuetify-using SFC under `pages/` (roughly 76 files) explicitly imports the Vuetify components its template uses, same pattern as ticket 01: named imports from `vuetify/components` in `<script setup>`, kebab-case template tags kept. Reuse the codemod persisted under `.scratch/explicit-vuetify-imports/` by ticket 01, then run the autofix pipeline and review the diff.

After this ticket, every Vuetify tag in the entire codebase has an explicit import — only the ESLint exemption (removed in ticket 04) still tolerates files that lack them.

**Blocked by:** 01 — Codemod + convert components/, App.vue, utils/ (reuses its codemod).

**Status:** ready-for-agent

- [ ] All Vuetify-using SFCs under `pages/` have explicit `vuetify/components` imports covering every Vuetify tag in their template
- [ ] Templates unchanged (kebab-case tags kept); only script blocks touched
- [ ] Full lint run green; `vue-tsc --noEmit` green
- [ ] No behavior change expected or observed (auto-import still on)
