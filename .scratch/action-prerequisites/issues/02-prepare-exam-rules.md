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

**Status:** ready-for-agent

- [ ] The `Prerequisite` concept gains members for Exam Template and
      Assessment Tool Connection, answered by the shared composable from the
      same sources the guarded wizard steps use.
- [ ] The Exam Template query opts out of the project's 30 second staleness
      with `staleTime: 0`, on this observer only, so other consumers of the
      same query key keep the project default.
- [ ] "Prepare Exam" declares both prerequisites; "Prepare Exam with URL"
      declares only Exam Template.
- [ ] When several prerequisites of one action are unmet, all applicable
      messages are shown, stacked, not just the first.
- [ ] The three new messages are added to the i18n namespace, English only,
      full static keys, no trailing periods. The Assessment Tool message
      follows the pattern of the others so the two-message case reads as
      parallel sentences.
- [ ] Browser verification in institution 6 with nothing set up: both links
      dead, "Prepare Exam" showing both messages together, "Prepare Exam with
      URL" showing only the Exam Template one.
- [ ] Browser verification with an Exam Template but no active Assessment
      Tool Connection: "Prepare Exam with URL" is live, "Prepare Exam" is
      dead and names only the Assessment Tool Connection.
- [ ] Browser verification that creating the missing entities leaves both
      links live on return.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
