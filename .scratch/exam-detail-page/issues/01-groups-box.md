# Groups box for the exam detail page

Status: needs-info
Parent: `.scratch/exam-detail-page/PRD.md` (deferred there under "Out of scope")
Depends on: SEBSERV-958 swap branch merged (`/exam/:id` serves the box-based page)

## Goal

Re-add the client-groups feature the old exam detail page had (table + add/edit/
delete), as a `BoxClientGroups` in the new page's box stack, reusing the shared
`ClientGroupsTable` widget the exam-template detail page already uses.

## Design decisions (settled 2026-07-27 with Alain — don't relitigate)

1. **Reuse `components/widgets/clientGroupsTable/`**, do NOT port the old
   bespoke dialogs (`AddClientGroupDialog` / `ClientGroupListDialog` /
   `EditClientGroupDialog`). The widget brings its own add/edit/delete flow via
   injected deps (`ClientGroupsTableDeps`).
2. **No SP column** in this ticket. Feed the widget no screen-proctoring deps
   (`enabled: false`-style constants / undefined strategy, whatever its types
   require): no SP column, no synthetic fallback row. Rationale: the exam level
   has no grouping strategy (only the on/off flag, see issue 02), so an
   editable per-group SP flag may be dead or misleading UI. See "Open question"
   below before ever adding it.
3. **No template-preset lookup.** The old page pre-ticked a new group's SP
   toggle from the template's SP selection (`getExamTemplateSp` →
   `templateGroupsWithSp`). Dropped deliberately; do not re-add.
4. **Gating:** extend the widget with an *optional* readonly/edit-disabled dep
   (e.g. `editDisabled?: Ref<boolean>`) that disables add/edit/delete
   affordances. Exam page passes
   `!ability.canDoExamAction(GUIAction.EDIT_CLIENT_GROUPS, exam)` (status-aware);
   the template page passes nothing and must stay behaviourally unchanged.
   Precedent: `BoxSupervisors` (exam gated, template ungated).
5. **Placement:** bottom of the box stack, after Supervisors
   (Basic Settings → SEB Settings → SEB Keys → Supervisors → **Groups**).

## Implementation notes

- Pattern source: `src/pages/(app)/exam-template/[id]/components/BoxClientGroups.vue`
  (thin wrapper: `DetailBox` + widget + a `useClientGroups`-style composable
  providing `clientGroups`, `createItem`, `updateItem`, `deleteItem`).
- Exam-side API: `services/seb-server/clientGroupService.ts`
  (`getClientGroups(examId)`, create/update/delete). Payload contract for
  create/update is documented by the old `buildClientGroup.ts` — recover with:
  `git show cb372564:"client/src/pages/(app)/exam/[id]/components/dialogs/client-group/utils/buildClientGroup.ts"`
  Flat object: `examId`, `name`, `type` + type-specific fields only
  (`ipRangeStart`/`ipRangeEnd` | `clientOS` | `nameRangeStartLetter`/`nameRangeEndLetter`).
- Type mismatch to bridge: the widget speaks `ClientGroup`/`ClientGroupExisting`
  from `models/seb-server/examTemplate.ts` (has `screenProctoringEnabled`); the
  exam API speaks `models/seb-server/clientGroup.ts` (has `isSPSGroup`,
  `examId`). Write a small adapter in the box composable; do not fork the
  widget's types.
- Read-only lookups live in the component (PRD design rule): the box self-
  fetches its groups; only nothing here mutates the exam entity itself, so the
  page composable's `updateExam` is not involved.
- i18n: new keys under `examDetail.boxes.clientGroups.*`, `en.json` only.

## Open question (for Andreas — blocks only the SP column, not this ticket)

Is per-group SP selection still meaningful for exams? The backend has
`POST /exam/{id}/screen-proctoring/apply-groups` (`spsSEBGroupsSelection` =
comma-list of group ids, reflected back as `isSPSGroup` per group), and the old
page used it. If YES, a follow-up can enable the widget's SP column with a
split save: group fields via `clientGroupService`, SP flag changes via
`applyScreenProctoringGroups` (recover from
`git show cb372564:client/src/services/seb-server/screenProctoringService.ts`).
If NO, delete this section and the `isSPSGroup` field's last GUI relevance.

## Acceptance

- `/exam/:id` shows a Groups box (after Supervisors) listing the exam's client
  groups; add/edit/delete work against the exam endpoints and refresh the list.
- No SP column, no synthetic fallback row on the exam page.
- Template detail page and template-create wizard client-group behaviour is
  byte-for-byte unchanged (widget extension is optional/additive).
- Edit affordances disabled when `EDIT_CLIENT_GROUPS` is not allowed for the
  exam's status (e.g. finished exam 9 in dev data → disabled).
- `npx vue-tsc --noEmit`, eslint, prettier pass; browser-verify via Playwright
  against the dev server (login super-admin/admin123, exams 7 running / 9
  finished; see PRD "Dev environment").

## Comments

- 2026-07-28 (Alain): Requirements changed since this was specced; the ticket
  needs revision before implementation. Set back to `needs-info` so no agent
  picks it up. Do not implement as written — wait for Alain to update the spec
  and restore `ready-for-agent`.
