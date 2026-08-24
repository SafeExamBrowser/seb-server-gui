# 03 — Fallback row in the groups step

**What to build:** When the selected exam template has screen proctoring
enabled, the Prepare-Exam "Add Groups" step shows the Screen Proctoring
Fallback Group as a row **after** all real client groups: checked + disabled
checkbox, not clickable, showing the shared name/type wording (legacy
"one group for exam" templates show their single-group variant). The row is
exempt from the search filter — it never disappears while searching. The row
is display-only: it must not affect the selection or the create request.

Data comes from the already-loaded selected template's exam attributes
(screen proctoring flag, collecting strategy, collecting group name); no new
fetch. Derivation goes through the shared helper from ticket 01. The step's
gating is unchanged: it still only appears when the template has at least one
real client group.

**Blocked by:** 01 — Shared fallback-group helper.

**Status:** done

- [x] Template 54 "Alain ClientGroups Test": groups step shows asdf, asdf2,
      then "Fallback Group" with a checked, disabled checkbox and the
      fallback type label; clicking the row changes nothing.
- [x] Searching for text matching no real group still shows the fallback row.
- [x] A template without screen proctoring shows no fallback row.
- [x] A legacy "one group for exam" template shows the single-group variant
      wording (e.g. template 65).
- [x] The create request payload is identical with and without the row on
      screen (fallback never in the client-group id list).
- [x] No additional network request is introduced for the fallback data.
- [x] Typecheck passes.

---

**Implemented** (2026-08-24, commits `2fd3199b` + review-fixes `c2ca8bf1`)

`StepClientGroups.vue` renders the fallback row as a fixed `v-list-item`
after the `v-for` over the filtered real groups (thus search-exempt), with a
checked disabled `v-checkbox-btn`, no click handler, and the shared type
label via `FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS`. Data comes from
`selectedExamTemplate.EXAM_ATTRIBUTES` through
`getScreenProctoringFallbackGroupForTemplate` — no new fetch. Review fix
added `active` so the row is highlighted like the checked rows.

Verification (Playwright against dev, 2026-08-24):
- Template 54: asdf, asdf2, then "Fallback Group" / "Screen Proctoring
  Fallback Group" (checked + disabled, row not clickable — clicking it
  changed no checkbox); row survived the search term "no-such-group-xyz"
  that hid both real groups.
- Template 75 "tessssst" (SP off, 2 groups): no fallback row.
- Template 64 (strategy `EXAM`): "Single Group" / "Screen Proctoring Single
  Group" (template 65's stored strategy turned out to be APPLY_SEB_GROUPS —
  see ticket 01's note).
- Create request carried only real ids (`clientGroupIds=3`; sentinel -1
  never appears); only the pre-existing
  `exam-template/{id}/screen-proctoring` fetch is made by the step.
