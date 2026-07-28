# Enforce the static-i18n-keys rule across the codebase

Status: needs-triage

## Problem

`.claude/rules/client.md` says: avoid generating i18n keys programmatically
(`$t(`` `${translationKeyPrefix}.title` ``)`); pass static strings to the
translation function. The codebase doesn't follow this consistently.

This has a real cost beyond style: programmatically built keys are invisible to
grep-based tooling. During the SEBSERV-958 swap (2026-07-27) an unused-key sweep
deleted `examDetail.deleteDialog.*` from `en.json` because no source file
contains those key strings — `DeleteConfirmDialog` assembles them from
`translation-key-prefix="examDetail"`. Only a browser check caught the missing
translations.

## Inventory (as of 2026-07-27)

Two classes of offenders — decide during triage whether both are in scope.

### Class 1: prefix-passing APIs (the class that bit us)

Widgets/helpers that take a key *prefix* and assemble full keys internally:

- `components/widgets/confirmDialog/DeleteConfirmDialog.vue` — `${translationKeyPrefix}.deleteDialog.{title,text,action}`
- `components/widgets/confirmDialog/StatusConfirmDialog.vue` — `${translationKeyPrefix}.statusDialog.*` (6 keys)
- `components/widgets/confirmDialog/GenericConfirmDialog.vue` — `${translationKeyPrefix}.confirm.{title,text,action}`
- `components/widgets/formBuilder/components/FormFieldTimeRange.vue` — `${props.label}.{labelFrom,labelTo}`
- local `const t = (key) => i18n.global.t(\`<prefix>.${key}\`)` wrappers in:
  - `pages/(app)/assessment-tool/composables/useAssessmentToolFormFields.ts`
  - `pages/(app)/institution/composables/useInstitutionFormFields.ts`
  - `pages/(app)/user-account/composables/useUserAccountFormFields.ts`
  - `pages/(app)/user-account/composables/useChangePasswordFormFields.ts`
  - `pages/(app)/connection-configuration/composables/useConnectionConfigurationFormFields.ts`
  - `pages/(public)/register/composables/useRegisterFormFields.ts`

Likely fix shape: the dialogs take full static key props (or resolved strings)
instead of a prefix; call sites each pass their own static keys. The `t`
wrappers get inlined with full keys.

### Class 2: enum/value-driven lookups

Keys built from a runtime enum value (`t(\`...types.${item.type}\`)`):

- `components/widgets/indicatorsTable/IndicatorsTable.vue`
- `components/widgets/clientGroupsTable/ClientGroupsTable.vue` + `composables/useFormFieldsBasic.ts`
- `pages/(app)/user-account/composables/useUserAccountFormFields.ts` (`general.userRoles.${value}`)
- `pages/(app)/user-account/components/UserAccountForm.vue` (`role.info.${role.value}`)
- `pages/(app)/monitoring/[examId]/components/dialogs/AskDialog.vue` (`statuses.${value}`)

The value domain is a finite enum, so these are less dangerous, but still
grep-invisible. If in scope, replace with an explicit value→static-key record.

## Acceptance

- No `$t(\`...${...}...\`)` / `i18n.global.t(\`...${...}...\`)` remains for the
  agreed scope (verify with `grep -rE '\$?t\(`' client/src`).
- Every en.json key is findable by grepping its full string in `client/src`.
- No visible translation regressions (missing-key console warnings) on the
  affected pages/dialogs.
