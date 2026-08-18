# Residual dynamic i18n keys the cleanup sweeps missed

Status: needs-triage

## Problem

The 2026-07-28 full-branch review of `general_i18n-cleanups` confirmed the branch
itself is clean (all inventoried sites converted, `vue-tsc`/eslint/vitest pass, manual
browser testing of every affected surface found zero regressions and zero missing-key
console warnings). But the codebase still does not satisfy the i18n rules in
`.claude/rules/client.md` (lines 46-53): the acceptance grep used by the earlier issues
(`grep -rE '\$?t\('`) has blind spots, and four whole classes of dynamic key
construction survived every sweep.

Consequence: the rule "every en.json key must appear verbatim in client/src" fails for
**641 of 1818 leaf keys** (mix of the dynamic consumers below and genuinely dead keys),
so an unused-key sweep is still unsafe — the same failure mode that bit us in
SEBSERV-958.

Prior art (patterns and history): `.scratch/static-i18n-keys/issues/01-static-i18n-keys.md`,
`.scratch/static-i18n-keys/issues/02-enum-value-driven-i18n-keys.md`,
`.scratch/i18n-in-composables/issues/*`.

## Inventory (verified 2026-07-28, paths relative to `client/`)

### Class A — sites hidden behind the `translate()` wrapper (`src/utils/generalUtils.ts`), ~30 sites

No `t(`-based grep can see these ("translate(" contains no "t(" substring).

Prefix-parameter APIs (the pattern issue static-i18n-keys/01 was created to kill, still alive here):

- `src/components/widgets/filters/statusFilterSection.ts` — `translationPrefix: string` param, 3 keys
- `src/components/widgets/filters/useInstitutionFilterSection.ts` — same, 1 key
- Callers passing `TRANSLATION_PREFIX` constants (filters and table headers):
  archive (`useArchiveTableFilters.ts`), analyze (`useAnalyzeTableFilters.ts`),
  exam (`useExamFilters.ts`, `useExamTableHeaders.ts`),
  monitoring (`useMonitoringFilters.ts`, `useMonitoringTableHeaders.ts`),
  scheduled-deletion (`useScheduledDeletionFilters.ts`, `useScheduledDeleteTableHeaders.ts`),
  assessment-tool (`useAssessmentToolsFilters.ts`), institution (`useInstitutionsFilters.ts`),
  connection-configuration, user-account list

Value-driven template literals through `translate()`:

- `src/pages/(app)/assessment-tool/composables/useAssessmentToolsFilters.ts:24` — `lmsTypes.${type}`
- `src/pages/(app)/assessment-tool/composables/useAssessmentToolsTableHeaders.ts:74` — `lmsTypes.${String(value)}`
  (`LMS_TYPE_LABEL_I18N_KEYS` already exists in `useAssessmentToolFormFields.ts` but is unexported — reuse it)
- `src/pages/(app)/certificate/composables/useCertificateTableHeaders.ts:55` — `certificates.types.${String(type)}`
- `src/pages/(app)/scheduled-deletion/composables/useScheduledDeleteTableHeaders.ts:47` — `scheduledDelete.status.${String(value)}`

Bracket-index keys (don't match the dotted en.json form, so verbatim checks miss them):

- `src/utils/generalUtils.ts:63-69` — `"clientGroups.description.ip[0]"` etc.

### Class B — multi-line `t(` template literals (single-line grep misses them)

- `src/components/layout/container/ContainerProfileMenu.vue:235` — `general.userRoles.${role}`
  (the same key family issue static-i18n-keys/02 converted elsewhere)
- `src/components/widgets/clientGroupsTable/composables/useFormFieldsTypeClientOS.ts:29` — `clientGroups.fields.clientOS.types.${value}`
- `src/components/widgets/indicatorsTable/composables/useFormFields.ts:124` — `indicators.fields.type.types.${value}`
- `src/composables/useScreenProctoringStrategyField.ts:23,34` — `screenProctoring.collectionStrategy.{info,strategies}.${...}`
- `src/pages/(app)/exam-template/create/components/stepSummary/helpers/getSummaryIndicators.ts:28` — `indicators.fields.type.types.${indicator.type}`
- Hint prefixes: `src/pages/(app)/assessment-tool/components/AssessmentToolForm.vue:13` and
  `src/pages/(app)/user-account/components/UserAccountForm.vue:13` — `...hints.${mode}`
- `src/services/errors/backendErrorText.ts:48-112` — `errors.backend.*` built from
  backend-provided domain/field/code. Open-ended value domain — the record idiom cannot
  apply. Needs a triage decision (see below).

### Class C — string concatenation

- `src/pages/(app)/scheduled-deletion/[id]/index.vue:57` — `"scheduledDelete.report.errorType." + ...`

### Class D — raw runtime values passed straight to `t()`

No key construction at all, so invisible to every grep. The keys are top-level en.json
entries named after enum values (`"MANAGED"`, `"BYOD"`, `"VDI"`, `"UNDEFINED"`).

Touched by `general_i18n-cleanups` but only half-converted (`useI18n` → `i18n.global.t`; dynamic key kept):

- `src/pages/(app)/exam-template/composables/useExamTemplateFilters.ts:16`
- `src/pages/(app)/exam-template/composables/useExamTemplateTableHeaders.ts:34` (cellFormatter)
- `src/pages/(app)/exam-template/[id]/components/BoxBasicSettings/composables/useBasicSettingsItems.ts:~67`
- `src/pages/(app)/exam/[id]/components/BoxBasicSettings/composables/useExamBasicSettingsFields.ts:93`

Pre-existing:

- `src/pages/(app)/exam-template/composables/useExamTemplateBasicSettingsFields.ts:108`
- `src/pages/(app)/exam/create/components/stepClientGroups/StepClientGroups.vue:44` — `$t(group.type)`
- `src/pages/(app)/exam/create/components/stepSummary/helpers/getSummaryClientGroups.ts:27` — `t(group.type)`
- `src/pages/(app)/monitoring/[examId]/client/[connectionToken]/components/MonitoringDetailsContextPanel.vue:35` — `$t(currentStatus)`

### Class E — dead / unverifiable keys

641 of 1818 en.json leaf keys have no verbatim source hit (scripted check, 2026-07-28).
Deleting the dead subset is only safe after Classes A-D are fixed and a reliable check
exists.

### Nits

- `TEST_ERROR_MESSAGE_KEYS` in `useAssessmentToolTestFlow.ts` doesn't follow the
  `_I18N_KEYS` suffix rule.
- `STATUS_LABEL_I18N_KEYS` in `AskDialog.vue` uses computed enum keys
  (`[ConnectionStatusEnum.X]:`) instead of the bare-literal style Alain requested for
  `clientGroupsTable/types.ts`.

## Open decisions for triage

1. `backendErrorText.ts`: the key domain is backend-driven and open-ended, so the
   `_I18N_KEYS`-record rule literally cannot apply. Documented exemption in
   `.claude/rules/client.md`, or a different mechanism?
2. **The** `translate()` **wrapper**: keep it (it handles null/undefined) or ban it? It is
   the reason Class A was invisible. If it stays, the rule and the check script must
   name it.
3. **Top-level enum keys** (`"MANAGED": "Managed Devices"` etc.): keep top-level with
   records pointing at them, or restructure en.json under a proper namespace while the
   call sites are being converted anyway?
4. **Enforcement**: replace the broken acceptance grep with a multiline-aware check
   script (must catch `t(`/`translate(` across lines, string concat, bracket-index
   keys, and do the en.json verbatim check). Where does it live (`client/scripts/`?),
   and does it become a CI/lint gate once the codebase is clean?

## Proposed fix shape

Follow the established idioms: `_I18N_KEYS` records for finite value domains
(`STRATEGY_LABEL_I18N_KEYS`, `TYPE_LABEL_I18N_KEYS`), fully resolved strings or full
static keys as props/params instead of prefixes (`StatusConfirmDialog` on this branch
is the model for the filter-section APIs).

Suggested split after triage (blocking edges in brackets):

1. Verbatim-key check script, report mode — first; it is the acceptance tool for all others.
2. Filter prefix APIs (Class A prefix params + callers).
3. `translate()` value-driven sites + bracket-index keys (rest of Class A).
4. Raw-enum-value keys (Class D) [blocked by decision 3].
5. Multiline `t(` + hint-prefix sites (Class B minus backendErrorText) + both nits.
6. Dead-key sweep + flip the script to a CI gate (Class E) [blocked by 1-5].

## Acceptance

- No dynamic key construction remains outside explicitly exempted sites (per triage
  decisions), verified by the new check script — not by a `t(`-grep.
- Every non-exempt en.json key is findable by grepping its full string in `client/src`;
  the dead remainder is deleted.
- No visible translation regressions on the affected pages (browser check, no new
  missing-key console warnings).

## Comments

> _This was generated by AI during a full-branch review._

**2026-07-28:** Filed after the review of `general_i18n-cleanups` (review session with
Alain). Verification context for the numbers above: the 641/1818 figure comes from an
ad-hoc node script comparing en.json leaf keys against concatenated `client/src`
sources; rebuild it properly as part of the enforcement decision. Browser verification
of the branch itself was done against the dev server (port 8082 that day) — the branch
is fine; this issue is exclusively about what it did **not** cover. Alain parks this
until roughly early August 2026.

### 2026-08-17 — Inventory update (SEBSERV-973)

`src/composables/useScreenProctoringStrategyField.ts` (listed above at lines
23,34) was deleted by the grouping-strategy cleanup, together with all six
`screenProctoring.collectionStrategy.*` keys — that inventory entry is
resolved by deletion.
