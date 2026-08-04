# PRD: Explicit Vuetify component imports

Status: ready-for-agent

## Problem Statement

Vuetify components are the last implicitly resolved components in the client codebase. Every app-authored component, composable, and even `RouterView`/`RouterLink` is explicitly imported where it is used — but Vuetify tags (`<v-btn>`, `<v-row>`, …) resolve invisibly through a build-time transform (`vite-plugin-vuetify` with `autoImport: true`). As a developer reading a component, I cannot see its Vuetify dependencies in the script block, cannot grep for "which files use `VDataTable`" via imports, and the codebase has two different rules for what a template may reference: app components must be imported (enforced by `vue/no-undef-components`), Vuetify components appear out of nowhere (exempted via `ignorePatterns: ["^V[A-Z]"]`).

## Solution

Convert all Vuetify component usage to explicit imports from `vuetify/components`, then remove the ESLint exemption so one uniform rule governs every component in every template: if a tag is used, it is imported — Vuetify or not. A forgotten import fails lint (pre-commit and CI) with the same error developers already know from app components. The build-time auto-import transform is switched off; `vite-plugin-vuetify` remains only for styles handling and asset URL transforms. Templates keep their kebab-case tags (`<v-btn>`); Vue resolves them against the PascalCase script-setup bindings, so the diff is confined to script blocks.

The migration is ordered so every intermediate commit is safe and independently verifiable: while `autoImport` is still on, explicit imports are harmless redundancy, so the import-adding commits cannot break the app. The risky flip (`autoImport: false` plus removal of the ESLint exemption) happens last, guarded by lint, typecheck, and a browser smoke test.

## User Stories

1. As a developer, I want every component used in a template to be explicitly imported in the script block, so that a component file fully declares its own dependencies.
2. As a developer, I want one uniform import rule for all components regardless of origin, so that I never have to remember which tags are magically available and which are not.
3. As a developer, I want a forgotten Vuetify import to fail ESLint immediately, so that the mistake is caught at pre-commit time instead of surfacing as a broken page at runtime.
4. As a developer, I want to grep for a Vuetify component's import to find all files using it, so that impact analysis for upgrades and refactors is a text search instead of a template audit.
5. As a code reviewer, I want a component's Vuetify surface visible in its import block, so that I can judge the weight and complexity of a component from its head.
6. As a developer, I want templates to keep their kebab-case Vuetify tags, so that the migration does not churn template markup and blame history stays useful.
7. As a developer, I want the build to no longer depend on a tag-rewriting compile transform for component resolution, so that what runs is what the source declares.
8. As a developer, I want the globally registered components in the Vuetify plugin setup moved to local imports, so that no component is registered app-wide when it is only used in a few places.
9. As a maintainer, I want each migration step to be a separate, independently verifiable commit, so that I can review and revert steps in isolation.
10. As a maintainer, I want every import-adding commit to be provably non-breaking (auto-import still active), so that the migration can land incrementally without risk windows.
11. As a maintainer, I want the final state enforced by an existing, already-proven lint rule rather than new tooling, so that the guarantee costs nothing to maintain.
12. As an AI coding agent working in this repo, I want component dependencies to be explicit in the file I am editing, so that I can reason about a component without knowing about a build-time transform.
13. As a developer onboarding to the project, I want the import conventions to match standard Vue practice with no project-specific magic, so that there is one less thing to learn.
14. As a developer, I want the migration to leave CSS/theming behavior untouched, so that no visual regressions can originate from this change.

## Implementation Decisions

- Components are imported as named imports from `vuetify/components` inside each SFC's `<script setup>` block. Templates keep kebab-case tags; Vue's compiler resolves kebab-case tags against PascalCase script-setup bindings.
- The conversion is codemod-driven: a script extracts the distinct Vuetify tags per SFC, maps kebab-case to PascalCase, validates every name against the actual exports of `vuetify/components`, and inserts or extends the import. Results are reviewed per commit, not blind-applied.
- Import ordering/formatting is left to the existing `simple-import-sort` ESLint rule and Prettier — the codemod only needs to insert syntactically valid imports and then run the autofix pipeline.
- The handful of SFCs that are template-only get a `<script setup lang="ts">` block added to hold their imports.
- The globally registered components in the Vuetify plugin setup (the former labs components: vertical stepper family, color input, file upload) move to local imports in the files that use them; the `components` option of `createVuetify` is removed entirely.
- `vite-plugin-vuetify` is kept, with `autoImport: false`. It still owns styles handling and provides `transformAssetUrls`. The global full-CSS import (`vuetify/styles/main.css`) is unchanged — this migration alters JS component resolution only, never styling.
- The `ignorePatterns: ["^V[A-Z]"]` exemption is removed from the `vue/no-undef-components` rule so the rule applies uniformly. No other rule changes; `RouterView`/`RouterLink` and app components already comply.
- Enforcement is lint-level by design, not type-level: Vuetify's type definitions unconditionally augment Vue's `GlobalComponents` interface (module augmentation is program-wide and cannot be scoped or disabled), so `vue-tsc` will always accept an unimported Vuetify tag. This was verified empirically with probe files; the ESLint rule was likewise empirically proven to catch undefined components. The lint rule is therefore a hard requirement of the end state, not an optional extra.
- Step ordering is a dependency chain: (1) add explicit imports across the codebase — safe while auto-import is still active; (2) localize the globally registered components; (3) flip `autoImport: false` and remove the ESLint exemption in the same step, since each is only correct in the presence of the other. Each step is one commit, independently verifiable.
- Deep imports from `vuetify/lib/...` paths that already exist in a few files (internal types/utilities not exported from the public entry points) are left as-is; they are explicit already and orthogonal to this migration.

## Testing Decisions

- Per project convention, no unit tests are written for this migration. Verification is external-behavior only, through three existing seams — no new seams are introduced:
  1. **ESLint (`vue/no-undef-components`) via the full lint run** — the completeness proof. Once the exemption is removed, a clean lint run guarantees every Vuetify tag in every template has an explicit import. This is the primary acceptance criterion.
  2. **`vue-tsc --noEmit`** — proves every imported name is a real export of `vuetify/components` (catches typos and wrong casing that lint alone would not).
  3. **Browser smoke test (Playwright) against the running dev server** — after the `autoImport: false` flip, walks the main views (login, dashboard, exam views, dialogs with the former labs components: stepper, color input, file upload, date input) and checks the console for "Failed to resolve component" warnings. This covers the one failure mode lint and types structurally cannot see: runtime resolution and styling without the transform.
- A good verification here checks observable outcomes (lint verdict, typecheck verdict, rendered UI without resolution warnings), never codemod internals.
- Prior art: the existing quality pipeline (`lint:check:all`, `vue-tsc` via the build script) and the existing Playwright e2e setup are used as-is.

## Out of Scope

- Enabling `strictTemplates` in the Vue compiler options (existing separate TODO; blocked on a known Vuetify issue).
- Migrating or cleaning up existing deep `vuetify/lib/...` imports.
- Normalizing template tag casing (kebab-case vs PascalCase) for Vuetify or app components.
- CSS treeshaking / replacing the global `vuetify/styles/main.css` import with per-component styles.
- Any changes to Vuetify version, theming, or the rules plugin setup.
- Introducing unit tests.

## Further Notes

- Scale, measured on the current branch: 165 of 225 SFCs use Vuetify tags, ~1,500 tag usages, 74 distinct components — all of them present in `vuetify/components` on Vuetify 4.1 (the formerly-labs components used here are stable now). No Vuetify directives are used anywhere, which removes the fiddliest part of manual imports.
- About 20 files already import from `vuetify/components` explicitly, so the target pattern has prior art in the codebase.
- The empirical probes behind the enforcement decisions: `vue-tsc` with the current config flags neither `<foo-non-existing>` nor an unimported `<v-btn>` as unknown (but does type-check the unimported `<v-btn>`'s props via the global augmentation); ESLint's `vue/no-undef-components` flags `<foo-non-existing>` today and will flag unimported Vuetify tags once the exemption is removed.
- The import-adding step produces a large but mechanical diff (~165 files touched at the top of their script blocks). Long-lived branches will conflict trivially (import-block conflicts); coordinate landing with open branches.
- Dynamic `<component :is="...">` usages are not covered by the lint rule, but they bind script variables whose existence TypeScript already enforces.
