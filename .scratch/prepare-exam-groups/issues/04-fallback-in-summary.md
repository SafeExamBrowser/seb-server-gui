# 04 — Fallback entry in the Configuration Summary

**What to build:** The Configuration Summary's client-groups section lists the
Screen Proctoring Fallback Group whenever the selected template has screen
proctoring enabled — in both Prepare-Exam flows, and **also** when the groups
step was skipped because the template has no real client groups. The entry
uses the same shape as the other group entries (name + type line, type wording
from the shared helper); no per-group screen proctoring boolean is added. The
entry is display-only and does not change the create request.

**Blocked by:** 01 — Shared fallback-group helper.

**Status:** done

- [x] Template 54, both groups selected: summary lists asdf, asdf2, then the
      fallback entry with the fallback type label.
- [x] A screen-proctoring template with zero real client groups (create one
      via the template wizard if none exists on dev): the wizard skips the
      groups step, yet the summary shows the fallback entry.
- [x] A template without screen proctoring shows no fallback entry.
- [x] A legacy "one group for exam" template shows the single-group variant
      wording in the summary.
- [x] The create request payload is unchanged by the summary entry.
- [x] Typecheck passes.

---

**Implemented** (2026-08-24, commits `77691b31` + review-fixes `c2ca8bf1`)

`useSummary.ts` derives the fallback from
`selectedExamTemplate.EXAM_ATTRIBUTES` via
`getScreenProctoringFallbackGroupForTemplate` (independent of the groups
store, so it also covers the skipped-step case) and passes it to
`getSummaryClientGroups`, which appends a name+type entry using the shared
label keys. Same wiring in both flows.

Verification (Playwright against dev, 2026-08-24):
- Template 54 with asdf unchecked: Groups section listed asdf2, then
  "Fallback Group" / "Screen Proctoring Fallback Group" (entry shape matches
  the real-group entries).
- Template 14 "Alain Indicator Tests" (SP on, strategy `EXAM`, zero groups):
  stepper had no Add Groups step, summary still showed "Single Group" /
  "Screen Proctoring Single Group" (name falls back to the i18n default —
  the template stores no collecting group name). This also covers the
  legacy-variant summary wording.
- Template 75 (SP off): Groups section listed only group 1 / group 2, no
  fallback entry.
- Saving created exam 15 with payload `clientGroupIds=3` only — the summary
  entry adds nothing to the request.
