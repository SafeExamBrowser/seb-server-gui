# 01 — Codemod + convert components/, App.vue, utils/

**What to build:** Every Vuetify-using SFC outside `pages/` (roughly 90 files: `components/`, `App.vue`, `utils/`) explicitly imports the Vuetify components its template uses, as named imports from `vuetify/components` in its `<script setup>` block. Templates keep their kebab-case tags. Template-only SFCs in scope get a `<script setup lang="ts">` block added to hold the imports. To a user of the running app, nothing changes — auto-import is still active, so the new imports are provably harmless redundancy.

The conversion is driven by a codemod: extract the distinct Vuetify tags per SFC, map kebab-case to PascalCase, validate every name against the actual exports of `vuetify/components`, insert or extend the import, then run the existing lint/format autofix pipeline for import sorting. Persist the codemod under `.scratch/explicit-vuetify-imports/` (not shipped code) so ticket 02 reuses it in a fresh session. Review the resulting diff — spot-check, don't blind-apply.

See the PRD (`.scratch/explicit-vuetify-imports/PRD.md`) for the full rationale and constraints.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Codemod exists under the feature's `.scratch` directory and validates names against real `vuetify/components` exports
- [ ] All Vuetify-using SFCs outside `pages/` have explicit `vuetify/components` imports covering every Vuetify tag in their template
- [ ] Templates unchanged (kebab-case tags kept); only script blocks touched
- [ ] Full lint run green; `vue-tsc --noEmit` green
- [ ] No behavior change expected or observed (auto-import still on)
