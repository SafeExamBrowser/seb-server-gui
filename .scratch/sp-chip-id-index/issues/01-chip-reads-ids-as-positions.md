# Screen Proctoring chips in Prepare Exam read group ids as list positions

Status: done

Found 2026-08-24 while investigating SEBSERV-970 (grilling session with Alain).
Out of scope for SEBSERV-970 (`.scratch/prepare-exam-groups/`), tracked here
separately.

## Symptom

In Prepare Exam → "Add Groups", the "Screen Proctoring" chip can be missing or
attached to the wrong group for templates whose client groups were modified
after creation. Dev example: template 54 "Alain ClientGroups Test" (groups
asdf id 0, asdf2 id 3; selection `"3"`) shows no chip on any row, while the
template detail page correctly shows asdf2 = Yes. Same data, two contradictory
displays.

## Root cause

`client/src/pages/(app)/exam/create/components/stepClientGroups/StepClientGroups.vue`
(`screenProctoringGroupIndices` / `isScreenProctoringGroup`, lines ~116-126)
tests membership with `availableGroups.indexOf(group)` — it treats the stored
`spsSEBGroupsSelection` values as **positions in the list**.

The field actually contains **client-group-template ids**. Verified both ways:

- Backend read path: `ExamTemplateServiceImpl.convertSPSTemplateSettings`
  matches the values against `gt.id` when creating an exam from a template.
- End-to-end probe on dev (2026-08-24): template 91 (groups Probe B id 1,
  Probe C id 2 after deleting id 0; selection `"2"`) → exam 13 created from it
  got client-group copies Probe B id 36 (`isSPSGroup: false`) and Probe C id 37
  (`isSPSGroup: true`), and exam SPS settings `spsSEBGroupsSelection: "37"`.
  The backend resolved `"2"` as Probe C's **id**, correctly.

## Why it usually looks right

Group-template ids are a per-template sequence starting at 0, assigned in
array order (`ExamTemplateDAOImpl.getNextClientGroupId`). For a freshly
wizard-created template id == position, so the chips happen to be correct.
They diverge as soon as a group is deleted on the detail page (ids keep their
values, positions shift).

For the same reason the template-creation wizard writing indices
(`useCreateExamTemplateStore.ts` `spsSEBGroupsSelection: ...index.toString()`)
is *accidentally correct*: the backend assigns matching sequential ids to the
one-shot payload. No behavior change needed there, but a comment stating the
coupling would help.

## Misleading breadcrumb

The comment on `client/src/models/seb-server/examTemplate.ts:98` claims the
field is a list of "ClientGroupTemplate list indices" — wrong (it describes
the write-time coincidence, not the field's semantics) and likely what led to
the index-based chip implementation. Note: `models/seb-server` is slated for
cleanup by Andrei — fix or drop the comment in whatever file survives.

## Fix

- `StepClientGroups.vue`: match by `group.id` instead of `indexOf`.
- Correct the model comment (indices → ids).
- Optional: comment in `useCreateExamTemplateStore.ts` documenting why writing
  indices is valid at creation time.

No backend change required.

## Verification fixture (kept on dev deliberately)

- Template 91 "ZZZ SEBSERV-970 id-index probe": ids 1, 2 at positions 0, 1;
  selection `"2"` = Probe C. Expected after fix: chip on Probe C only
  (today: no chip at all).
- Template 54 "Alain ClientGroups Test": selection `"3"` = asdf2. Expected
  after fix: chip on asdf2 (today: no chip).
- Control: template 22 "test final" (ids == positions, selection `"0,2"`)
  must keep chips on "group 1" and "gropu3".
- Exam 13 "ZZZ SEBSERV-970 probe exam" documents the end-to-end mapping.

---

**Implemented** (2026-08-24)

All three fix items applied:

- `StepClientGroups.vue`: `isScreenProctoringGroup` now tests
  `screenProctoringGroupIds.has(group.id)` (set renamed from
  `...Indices`); the `indexOf` position lookup is gone.
- `models/seb-server/examTemplate.ts`: field comment and footnote (1)
  corrected from "list indices" to "ids"; footnote now states that the
  backend matches the values against ClientGroupTemplate ids, not list
  positions.
- `useCreateExamTemplateStore.ts`: comment added documenting why writing
  indices is valid at creation time only (backend assigns sequential ids
  0, 1, ... to the one-shot payload in array order).

Verification (Playwright against dev, 2026-08-24, `vue-tsc` clean):

- Template 91 "ZZZ SEBSERV-970 id-index probe" (ids 1, 2; selection `"2"`):
  chip on Probe C only — before the fix no chip at all. Chip follows
  Probe C through the search filter; fallback row stays search-exempt.
- Template 54 "Alain ClientGroups Test" (selection `"3"`): chip on asdf2
  only — before the fix no chip.
- Control template 22 "test final" (ids == positions, selection `"0,2"`):
  chips still on "group 1" and "gropu3", none on "grpuo2".
- Configuration Summary for template 22 unchanged: three real groups plus
  the SEBSERV-970 fallback-group row.

Code review note — considered and declined: deriving the chip from the
per-group `screenProctoringEnabled` flag on `CLIENT_GROUP_TEMPLATES`
(would remove the `exam-template/{id}/screen-proctoring` fetch and the id
parsing). Declined because `spsSEBGroupsSelection` is what
`convertSPSTemplateSettings` actually consumes at exam creation; the chip
mirrors that source of truth, and flag/selection equivalence after
detail-page edits is unverified. Pre-existing, out of scope:
`useExamTemplateScreenProctoring` is a `useMutation` for a pure GET
(last-resolved-wins race when switching templates quickly, no caching);
`createNumberIdList("")` returns `[NaN]` (harmless here).
