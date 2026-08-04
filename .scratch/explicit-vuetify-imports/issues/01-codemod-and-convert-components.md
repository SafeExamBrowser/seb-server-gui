# 01 — Codemod + convert components/, App.vue, utils/

**What to build:** Every Vuetify-using SFC outside `pages/` (roughly 90 files: `components/`, `App.vue`, `utils/`) explicitly imports the Vuetify components its template uses, as named imports from `vuetify/components` in its `<script setup>` block. Templates keep their kebab-case tags. Template-only SFCs in scope get a `<script setup lang="ts">` block added to hold the imports. To a user of the running app, nothing changes — auto-import is still active, so the new imports are provably harmless redundancy.

The conversion is driven by a codemod: extract the distinct Vuetify tags per SFC, map kebab-case to PascalCase, validate every name against the actual exports of `vuetify/components`, insert or extend the import, then run the existing lint/format autofix pipeline for import sorting. Persist the codemod under `.scratch/explicit-vuetify-imports/` (not shipped code) so ticket 02 reuses it in a fresh session. Review the resulting diff — spot-check, don't blind-apply.

See the PRD (`.scratch/explicit-vuetify-imports/PRD.md`) for the full rationale and constraints.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [x] Codemod exists under the feature's `.scratch` directory and validates names against real `vuetify/components` exports
- [x] All Vuetify-using SFCs outside `pages/` have explicit `vuetify/components` imports covering every Vuetify tag in their template
- [x] Templates unchanged (kebab-case tags kept); only script blocks touched
- [x] Full lint run green; `vue-tsc --noEmit` green
- [x] No behavior change expected or observed (auto-import still on)

---

**Implemented** (2026-08-04)

- Codemod at `.scratch/explicit-vuetify-imports/codemod.mjs`; run from `client/` with the target paths as args (`node ../.scratch/explicit-vuetify-imports/codemod.mjs src/components src/utils src/App.vue`). Idempotent — a re-run reports 0 changes.
- Valid names are collected from `node_modules/vuetify/lib/components/*/index.d.ts`, covering both `export { VBtn }` re-exports and the `export declare const VFabTransition` shape used by the transitions folder. Unknown `v-*`/`V*` tags fail the run.
- 89 SFCs changed (components/, utils/, App.vue); 62+ distinct components. Only script blocks touched — the diff's single deleted line is `FormFields.vue`'s old one-name import that got extended.
- Template-only `BasicGrid.vue` uses no Vuetify tags, so no script block needed to be added outside `pages/`.
- Pitfall found and fixed: the script-open regex must tolerate `>` inside `generic="TItem extends Record<string, any>, …"` attribute values (`CrudTable.vue`).
- Verification: `lint:check:all` exit 0, `vue-tsc --noEmit` exit 0, after `lint:fix:all` + `prettier:fix:all` for import sorting/wrapping.
