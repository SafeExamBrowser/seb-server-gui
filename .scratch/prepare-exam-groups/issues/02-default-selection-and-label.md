# 02 — Default selection + label

**What to build:** In Prepare Exam (both flows), the "Add Groups" step starts
with **all** of the selected template's client groups selected, so the default
outcome shown matches what the backend creates. The administrator can unselect
groups; those choices survive navigating back and forth through the wizard.
Picking a *different* exam template resets the selection to all of the new
template's groups. The step subtitle reads "Remove or Select Groups".

Empty selection stays allowed — the known, accepted quirk that a blank
selection makes the backend copy all template groups is documented in the PRD
and must not be guarded against.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] Selecting a template and reaching the groups step shows every group
      checked (template 54 "Alain ClientGroups Test": asdf and asdf2).
- [x] Unselecting a group, going back, and returning (same template) keeps
      the unselection.
- [x] Going back and selecting a *different* template shows the new
      template's groups all checked; no stale selection leaks over.
- [x] The create request's client-group id list contains exactly the ids of
      the checked groups (network tab).
- [x] Unselecting everything is possible; "Next" stays enabled.
- [x] Subtitle shows "Remove or Select Groups"; the en.json key's old wording
      is gone; de.json untouched (stub).
- [x] Typecheck passes.

---

**Implemented** (2026-08-24, commit `5710ad2b`)

`handleSelect` in `StepExamTemplate.vue` now always seeds
`stepClientGroupsStore.selectedClientGroups` with all of the picked
template's `CLIENT_GROUP_TEMPLATES` (replacing the old only-when-exactly-one
special case); the pre-existing same-id early return keeps user unselections
across back/forward, and its `$reset` path handles the template switch.
Subtitle key `createExam.steps.clientGroups.subtitle` reworded in en.json
only.

Verification (Playwright against dev, 2026-08-24, with-URL flow, plus
assessment-tool flow spot check with "test" tool / Demo Quiz 2):
- Template 54 → groups step: asdf + asdf2 both checked, subtitle "Remove or
  Select Groups".
- Unchecked asdf → Back → Next: unselection kept.
- Switched to template 91 "ZZZ SEBSERV-970 id-index probe": Probe B + Probe C
  both checked, no stale leak; re-picking 54 afterwards reset it to all
  checked again.
- Created exam with asdf unchecked: POST /api/exam body carried
  `clientGroupIds=3` (asdf2 only, ids not positions); backend created exam 15
  with exactly one group "asdf2" (GET /api/client-group?examId=15).
