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

**Status:** ready-for-agent

- [ ] Selecting a template and reaching the groups step shows every group
      checked (template 54 "Alain ClientGroups Test": asdf and asdf2).
- [ ] Unselecting a group, going back, and returning (same template) keeps
      the unselection.
- [ ] Going back and selecting a *different* template shows the new
      template's groups all checked; no stale selection leaks over.
- [ ] The create request's client-group id list contains exactly the ids of
      the checked groups (network tab).
- [ ] Unselecting everything is possible; "Next" stays enabled.
- [ ] Subtitle shows "Remove or Select Groups"; the en.json key's old wording
      is gone; de.json untouched (stub).
- [ ] Typecheck passes.
