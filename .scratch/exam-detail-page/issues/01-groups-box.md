# Groups box for the exam detail page

Status: ready-for-human
Parent: `.scratch/exam-detail-page/PRD.md` (deferred there under "Out of scope")
Branch: `SEBSERV-958_groups`

## Goal

Add a Groups box to the `/exam/:id` box stack that lists the exam's client
groups and lets the user populate them by **copying client groups from the
exam's template**. Groups on an exam are copy-only: not editable, only
deletable.

## Domain model (see `client/CONTEXT.md`)

A **Client Group** is the same concept whether it lives on an exam template or
on an exam. The template's client groups serve as *blueprints*: copying one
onto an exam creates a detached client group there — no link back, deleting
either side never affects the other, and later edits on the template side do
not propagate.

## Design decisions (settled 2026-08-03 with Alain — don't relitigate)

1. **Copy-only.** Copy-from-template is the sole way a group gets onto an exam:
   no free-form create form, no editing of a copied group. Fix a mistake by
   delete + re-copy.
2. **Duplicates allowed.** The picker always offers every template group;
   copying the same blueprint twice yields two identical, independently
   deletable exam groups. No name-based filtering or disabling.
3. **Copy payload:** name, type, and the type-specific criteria fields only
   (`ipRangeStart`/`ipRangeEnd` | `clientOS` | `nameRangeStartLetter`/
   `nameRangeEndLetter`). The template's SP flag is ignored (no `isSPSGroup`),
   as are color/icon.
4. **Local table, not the shared widget.** The box gets its own plain
   `v-data-table` (BoxSupervisors-style). Columns: **name, translated type,
   actions** (row delete button with the standard confirm dialog). No SP
   column, no criteria column. The shared
   `components/widgets/clientGroupsTable/` widget stays template-only and
   byte-for-byte untouched.
5. **Picker = popover, click = copy.** The box header has a pencil
   `BoxActionButton` opening a popover (`v-menu`) anchored to it, listing the
   template's client groups. Clicking an entry immediately copies it (POST +
   list refresh); the popover stays open so several can be copied in a row.
   If the template has no groups — or the template has been deleted (fetch
   404s) — the popover shows an empty-state message; the pencil itself stays
   enabled.
6. **Gating:** pencil and row-delete buttons disabled via
   `useExamActionDisabled(exam, GUIAction.EDIT_CLIENT_GROUPS)` (both already
   exist). The list stays visible read-only. The template page is unaffected.
7. **Placement:** bottom of the box stack, slot `#05_clientGroups` after
   Supervisors (Basic Settings → SEB Settings → SEB Keys → Supervisors →
   **Groups**).

## Implementation notes

- Self-contained component `pages/(app)/exam/[id]/components/BoxClientGroups/`
  (`DetailBox` + `BoxActionButton` header pattern; see
  `components/widgets/BoxSupervisors.vue` for the shape).
- Read-only lookups live in the component (PRD design rule): the box
  self-fetches its groups via `clientGroupService.getClientGroups(examId)`
  (paged response — use `.content`). Template groups are fetched on demand for
  the popover via `examTemplateService.getExamTemplate(exam.examTemplateId)` →
  `CLIENT_GROUP_TEMPLATES` (already zod-parsed to `ClientGroupExisting[]`).
- Copy = `clientGroupService.createClientGroup({ examId, name, type,
  ...criteria })`. Payload contract proven by the old page's
  `buildClientGroup.ts` — recover with:
  `git show cb372564:"client/src/pages/(app)/exam/[id]/components/dialogs/client-group/utils/buildClientGroup.ts"`
  Flat object, type-specific fields only.
- Delete = `clientGroupService.deleteClientGroup(id)` + refresh.
- Use `useFetch`/`useMutation` per client rules.
- Two type worlds meet here: template groups are `ClientGroupExisting`
  (`models/seb-server/examTemplate.ts`), exam groups are `ClientGroup`
  (`models/seb-server/clientGroup.ts`). The copy mapping is a small pure
  function in the box's composable; don't fork or bridge the widget's types.
- Type labels: the static keys `clientGroups.fields.type.types.*` already
  exist; reuse them (e.g. import `TYPE_LABEL_I18N_KEYS` from the widget's
  `types.ts` — constants-only import, or define a local record with the same
  full static keys). Mind the i18n rules: full static keys only.
- New i18n keys under `examDetail.boxes.clientGroups.*`, `en.json` only.

## Open question (for Andreas — parked, does not block this ticket)

Is per-group SP selection still meaningful for exams? The backend has
`POST /exam/{id}/screen-proctoring/apply-groups` (`spsSEBGroupsSelection`,
reflected back as `isSPSGroup` per group). If YES, a follow-up may add an SP
column/flow to this box. If NO, delete this section and the `isSPSGroup`
field's last GUI relevance.

## Acceptance

- `/exam/:id` shows a Groups box (after Supervisors) listing the exam's client
  groups with name, type, and a delete action.
- Pencil opens the popover listing the exam template's groups; clicking one
  copies it to the exam (detached; duplicates allowed) and the table refreshes
  without closing the popover.
- Row delete asks for confirmation, removes only the exam's group, and leaves
  the exam template's groups untouched (verify on the template detail page).
- Template with no groups (or deleted template) → popover shows the
  empty-state message.
- Pencil and delete disabled when `EDIT_CLIENT_GROUPS` is not allowed for the
  exam's status (dev data: exam 7 running → enabled, exam 9 finished →
  disabled); table stays visible.
- Template detail page and template-create wizard client-group behaviour is
  byte-for-byte unchanged (shared widget untouched).
- `npx vue-tsc --noEmit`, eslint, prettier pass; browser-verify via Playwright
  against the dev server (login super-admin/admin123; see PRD "Dev
  environment").

## Comments

- 2026-07-28 (Alain): Requirements changed since this was specced; the ticket
  needs revision before implementation. Set back to `needs-info` so no agent
  picks it up. Do not implement as written — wait for Alain to update the spec
  and restore `ready-for-agent`.
- 2026-08-03 (Alain, via grilling session): Ticket rewritten from scratch.
  New model: copy-from-template only (blueprint semantics, detached copies),
  no editing, local table instead of extending the shared widget. All
  decisions above re-settled; `ready-for-agent` restored.
- 2026-08-03 (agent): Implemented. New self-contained
  `pages/(app)/exam/[id]/components/BoxClientGroups/` (component +
  `useClientGroupsBox` composable + pure `templateGroupToClientGroup` mapping
  with a vitest unit test), wired as slot `#05_clientGroups` after
  Supervisors; i18n under `examDetail.boxes.clientGroups.*` (en.json only).
  One shared-widget touch beyond the ticket: `BoxActionButton` now forwards
  the native `MouseEvent` on its `click` emit — required for the `v-menu`
  activator (`stopPropagation`), backward-compatible for existing callers.
  The `clientGroupsTable` widget is untouched. Verification: `npx vue-tsc
  --noEmit`, eslint, prettier, vitest all pass; browser-verified via
  Playwright on the dev server — exam 5 (Running, template 71): popover
  empty state, then after adding "Lab IP Range" (IP) + "Windows Clients"
  (OS) to template 71 via the template page, copied IP group twice
  (duplicates OK, popover stayed open, POST payload =
  `examId,name,type,criteria` only) and OS group once; row delete with
  confirm removed only the exam copy (template still has both groups + SP
  row); exam 9 (Finished): header button + row delete disabled
  (`v-icon-btn--disabled`, pointer-events none), table stays visible with
  its existing group. Dev-data side effects left in place: template 71 now
  has the two groups above, exam 5 has one "Lab IP Range" + one "Windows
  Clients" copy. Note: exam 7 is meanwhile Archived and its detail grid
  doesn't render (pre-existing `examConfigMapping` 404), so the
  enabled-state check used exam 5 instead. Post-review fix: template groups
  are ignored when the template fetch errors, so a template deleted after a
  successful fetch shows the empty state instead of stale groups.
- 2026-08-03 (Alain): The box header button is an add button, not a pencil —
  `mdi-plus-circle-outline` with label "Add client groups from template"
  (i18n key `addButton`), matching the template page's "Add Group" button.
  Supersedes the "pencil" wording in decisions 5/6; implemented and
  browser-verified on exam 5.
