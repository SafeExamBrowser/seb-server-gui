# Sweep: composables must use `i18n.global.t`, not `useI18n()`

Status: ready-for-agent

## Problem

During the SEBSERV-958 code review (2026-07-27) the i18n rule in
`.claude/rules/client.md` was sharpened: only a component's literal setup
function (`<script setup>`) may use `useI18n()`; composables always use
`i18n.global.t`. The new exam-detail-page code was aligned in that PR
(`useBasicSettingsItems.ts`), but 17 pre-existing composables still use
`useI18n()` and now violate the rule.

## Inventory (as of 2026-07-27)

All paths relative to `client/src/pages/(app)/`:

- `analyze/composables/useAnalyzeTableActions.ts`
- `archive/composables/useArchiveTableAdditions.ts`
- `assessment-tool/composables/useAssessmentToolTestFlow.ts`
- `assessment-tool/composables/useAssessmentToolsTableActions.ts`
- `certificate/composables/useCertificatesTableActions.ts`
- `connection-configuration/composables/useConnectionConfigurationsTableActions.ts`
- `exam/composables/useExamTableActions.ts`
- `exam-template/composables/useExamTemplateFilters.ts`
- `exam-template/composables/useExamTemplateTableActions.ts`
- `exam-template/composables/useExamTemplateTableHeaders.ts`
- `exam-template/[id]/components/BoxBasicSettings/composables/useBasicSettingsItems.ts`
- `institution/composables/useInstitutionsTableActions.ts`
- `monitoring/composables/useMonitoringTableActions.ts`
- `scheduled-deletion/composables/useScheduledDeletionReport.ts`
- `scheduled-deletion/composables/useScheduledDeletionTableActions.ts`
- `user-account/composables/useUserAccountsOverview.ts`
- `user-account/composables/useUserAccountsTableActions.ts`

## Fix shape

Mechanical, per file: drop the `useI18n` import and `const { t } = useI18n()`,
import `i18n` from `@/i18n`, replace `t(...)` calls with `i18n.global.t(...)`.
The reference conversion is `exam/[id]/components/BoxBasicSettings/composables/useBasicSettingsItems.ts`
(SEBSERV-958 branch). All messages live in the global scope, and
`i18n.global.t` stays reactive inside computeds, so behaviour is unchanged.

## Acceptance

- `grep -rl "useI18n" client/src --include=*.ts` returns nothing —
  `useI18n()` remains only in `.vue` files.
- `vue-tsc --noEmit`, ESLint, and Prettier pass.
- Spot-check a few affected pages (exam list actions, monitoring table,
  user accounts) in the browser: labels/tooltips still render translated.

## Comments

**2026-07-28 (agent):** Implemented. All 17 composables converted to
`i18n.global.t` following the reference pattern. Verification:

- `grep -rl "useI18n" client/src --include=*.ts` returns nothing
- `vue-tsc --noEmit`, `eslint .`, and Prettier all pass
- Browser spot-check (exam list "View" action, monitoring table,
  user-accounts "Edit"/"Delete" actions): labels render translated

Note: six `use*FormFields.ts` composables define a local
`const t = (key) => i18n.global.t(...)` prefix helper — already
rule-compliant, left untouched.
