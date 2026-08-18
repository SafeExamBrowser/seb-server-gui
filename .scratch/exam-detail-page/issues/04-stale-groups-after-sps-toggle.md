# 04 — Groups table shows stale SPS flags after template-level SPS toggle

Labels: ready-for-human
Reported by Alain 2026-08-18 (SEBSERV-973 verification follow-up).

## Symptom

On the exam-template detail page (e.g. `/exam-template/86`): turn template-level
Screen Proctoring off, save, turn it on again — the group's Screen Proctoring
cell shows "No" although the server has `screenProctoringEnabled: true`. A hard
reload shows the correct "Yes".

## Diagnosis

Two ingredients (verified with a scripted Playwright loop + direct API calls):

1. The backend rewrites the **group** flags when template-level SPS toggles:
   disable → all group `screenProctoringEnabled` become `false`; re-enable →
   flags are re-derived from `spsSEBGroupsSelection`. Synchronous, server state
   always consistent.
2. `useClientGroups` seeded a local `ref([...initialClientGroups])` **once at
   mount** and only its own create/update/delete mutated it. Template-query
   refetches (triggered by `handleBasicSettingsChange`) never reached the
   table, so the rows showed mount-time flags forever. The staleness exists in
   both directions; it becomes visible as "No" when the page was mounted while
   SPS was off.

## Fix (implemented 2026-08-18)

- `composables/api/useClientGroups.ts`: dropped the local copy entirely; the
  composable now only exposes create/update/delete, each of which invalidates
  the exam-template-by-id query so the whole template (groups **and**
  backend-derived attributes) refetches.
- `components/BoxClientGroups.vue`: the table's `clientGroups` dep is now a
  computed over the reactive `clientGroups` prop (single source of truth: the
  template query).

## Verification (Playwright vs running dev server, template 86)

- Previously-red sequence now green: SPS off + save → reload (mount in off
  state) → SPS on + save → row shows "Yes"/checked immediately, matching
  server `screenProctoringEnabled: true`; no hard reload needed.
- Group CRUD through the new invalidation path: created "crud-check" group →
  row appears via refetch; deleted it → row disappears. Template 86 restored
  to original state (testgroup SPS on).
- `npx vue-tsc --noEmit` and eslint clean on both changed files.
