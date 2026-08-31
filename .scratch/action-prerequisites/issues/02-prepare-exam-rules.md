# 02 — Prepare Exam and Prepare Exam with URL rules

**What to build:** On the Navigation Overview, "Prepare Exam" is dimmed and
non-clickable unless the institution has both at least one Exam Template and
at least one active Assessment Tool Connection, and "Prepare Exam with URL"
unless it has at least one Exam Template. Their info buttons name what is
missing — and when "Prepare Exam" is missing both, it says so about both at
once rather than revealing the second demand only after the first is met.

"Prepare Exam with URL" deliberately does **not** require an Assessment Tool
Connection: that flow exists to prepare an exam without an LMS. An
institution with an Exam Template and no Assessment Tool Connection has a
live "Prepare Exam with URL" and a dead "Prepare Exam".

Follow the decisions in `../PRD.md`. In particular: the Assessment Tool
answer comes from the same active LMS setup fetch the exam wizard's
assessment tool step uses, not from the names endpoint, which cannot express
"active"; the Exam Template answer comes from the exam template names fetch
with `staleTime: 0` so a just-created template is seen on return.

**Blocked by:** 01 — the seam, the disabled rendering and the info button
must exist.

**Status:** done

- [x] The `Prerequisite` concept gains members for Exam Template and
      Assessment Tool Connection, answered by the shared composable from the
      same sources the guarded wizard steps use.
- [x] The Exam Template query opts out of the project's 30 second staleness
      with `staleTime: 0`, on this observer only, so other consumers of the
      same query key keep the project default.
- [x] "Prepare Exam" declares both prerequisites; "Prepare Exam with URL"
      declares only Exam Template.
- [x] When several prerequisites of one action are unmet, all applicable
      messages are shown, stacked, not just the first.
- [x] The three new messages are added to the i18n namespace, English only,
      full static keys, no trailing periods. The Assessment Tool message
      follows the pattern of the others so the two-message case reads as
      parallel sentences.
- [x] Browser verification in institution 6 with nothing set up: both links
      dead, "Prepare Exam" showing both messages together, "Prepare Exam with
      URL" showing only the Exam Template one.
- [x] Browser verification with an Exam Template but no active Assessment
      Tool Connection: "Prepare Exam with URL" is live, "Prepare Exam" is
      dead and names only the Assessment Tool Connection.
- [x] Browser verification that creating the missing entities leaves both
      links live on return.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).

---

**2026-08-31 — Implemented**

- `Prerequisite` gained `EXAM_TEMPLATE` and `ASSESSMENT_TOOL_CONNECTION`.
- The assessment tool answer reuses the wizard's own active LMS setup fetch:
  `useAssessmentTools` moved from
  `pages/(app)/exam/create/components/stepAssessmentTool/composables/api/` to
  `src/composables/` now that it has a second consumer ("as local as possible,
  as global as necessary"); the two wizard imports were updated, nothing else
  changed.
- `useExamTemplateNames` gained an optional `{ staleTime }`; the seam passes
  `staleTime: 0`, which is per observer, so the exam side panel keeps the
  project default and merely gets the fresher value.
- "Prepare Exam" declares `[EXAM_TEMPLATE, ASSESSMENT_TOOL_CONNECTION]`,
  "Prepare Exam with URL" only `[EXAM_TEMPLATE]`. `unmet()` preserves
  declaration order, so the two messages stack template-first.

Verification (dev server, Playwright, `test-exam-admin` in institution 6):

- Empty institution: all three preparation actions dimmed and non-link.
  "Prepare Exam" showed both messages stacked in one tooltip; "Prepare Exam
  with URL" showed only the Exam Template one.
- With Exam Template 92 created and no active Assessment Tool Connection:
  "Prepare Exam with URL" was a live link, "Prepare Exam" stayed dead and
  named only the Assessment Tool Connection.
- After activating LMS Setup 6 ("Prereq Verification Tool", MOCKUP) and
  Connection Configuration 7, all three actions were live links on return.
  The wizard opened from the live link and listed the mock LMS quizzes, so
  the moved composable still serves the wizard.
- `npx vue-tsc --noEmit`, eslint and prettier clean.
