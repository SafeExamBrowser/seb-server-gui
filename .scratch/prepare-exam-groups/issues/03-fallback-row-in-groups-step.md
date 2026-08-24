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

**Status:** ready-for-agent

- [ ] Template 54 "Alain ClientGroups Test": groups step shows asdf, asdf2,
      then "Fallback Group" with a checked, disabled checkbox and the
      fallback type label; clicking the row changes nothing.
- [ ] Searching for text matching no real group still shows the fallback row.
- [ ] A template without screen proctoring shows no fallback row.
- [ ] A legacy "one group for exam" template shows the single-group variant
      wording (e.g. template 65).
- [ ] The create request payload is identical with and without the row on
      screen (fallback never in the client-group id list).
- [ ] No additional network request is introduced for the fallback data.
- [ ] Typecheck passes.
