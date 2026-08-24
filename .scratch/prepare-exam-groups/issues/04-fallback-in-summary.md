# 04 — Fallback entry in the Configuration Summary

**What to build:** The Configuration Summary's client-groups section lists the
Screen Proctoring Fallback Group whenever the selected template has screen
proctoring enabled — in both Prepare-Exam flows, and **also** when the groups
step was skipped because the template has no real client groups. The entry
uses the same shape as the other group entries (name + type line, type wording
from the shared helper); no per-group screen proctoring boolean is added. The
entry is display-only and does not change the create request.

**Blocked by:** 01 — Shared fallback-group helper.

**Status:** ready-for-agent

- [ ] Template 54, both groups selected: summary lists asdf, asdf2, then the
      fallback entry with the fallback type label.
- [ ] A screen-proctoring template with zero real client groups (create one
      via the template wizard if none exists on dev): the wizard skips the
      groups step, yet the summary shows the fallback entry.
- [ ] A template without screen proctoring shows no fallback entry.
- [ ] A legacy "one group for exam" template shows the single-group variant
      wording in the summary.
- [ ] The create request payload is unchanged by the summary entry.
- [ ] Typecheck passes.
