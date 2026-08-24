# PRD: Prepare Exam — group selection & fallback group (SEBSERV-970)

Status: done — all four issues implemented and browser-verified 2026-08-24
(see the dated "Implemented" comments in the issue files)

Branch: `SEBSERV-970_prepare-exam`
Settled 2026-08-24 in a grilling session with Alain — don't relitigate the
decisions below; ask only if the code contradicts them.

## Problem Statement

When an exam administrator prepares an exam (with or without an exam URL),
the "Add Groups" step misrepresents what the created exam will actually get:

- No client groups are preselected, yet leaving the selection empty makes the
  backend copy **all** of the template's client groups onto the exam — the
  step's empty state is a lie.
- The Screen Proctoring Fallback Group is invisible in both the groups step
  and the Configuration Summary, even though every screen-proctored exam
  receives it. Administrators cannot see the complete picture of the groups
  their exam will have.
- The step's subtitle reads "Select or Remove Groups", which no longer matches
  the new default-selected flow.

## Solution

The groups step starts with **all** of the selected template's client groups
selected (matching what the backend does with an untouched selection), lets
the administrator unselect the ones they don't want, and shows the Screen
Proctoring Fallback Group as a fixed, always-included row whenever the
template has screen proctoring enabled. The Configuration Summary lists the
fallback group under the same rules. The rules for deriving the fallback
group (whether it exists, its name, its type label) are shared with the exam
template pages instead of being duplicated.

## User Stories

1. As an exam administrator, I want all of the template's client groups to be
   selected by default in the groups step, so that the default outcome I see
   matches the exam the backend actually creates.
2. As an exam administrator, I want to unselect individual client groups, so
   that my exam only receives the group blueprints I actually need.
3. As an exam administrator, I want my manual unselections to survive
   navigating back and forth through the wizard, so that I don't have to
   redo my choices.
4. As an exam administrator, I want the selection to reset to "all selected"
   when I pick a *different* exam template, so that stale choices from the
   previous template never leak into the new one.
5. As an exam administrator, I want to see the Screen Proctoring Fallback
   Group as a row in the groups step whenever the selected template has
   screen proctoring enabled, so that I know my exam will include it.
6. As an exam administrator, I want the fallback group row to be visibly
   checked but not interactive, so that it's clear it is always part of the
   exam and cannot be removed.
7. As an exam administrator, I want the fallback group row to keep the same
   name and type wording I know from the exam template pages (including the
   legacy "one group for exam" variant), so that both areas of the app tell
   the same story.
8. As an exam administrator, I want the fallback group to stay visible while
   I'm searching for groups, so that the always-included part of my exam
   never appears to vanish.
9. As an exam administrator, I want the Configuration Summary to list the
   fallback group alongside my selected client groups, so that the final
   review shows everything the exam will get.
10. As an exam administrator using a template with screen proctoring but no
    client groups, I want the summary to still show the fallback group even
    though the wizard skipped the groups step, so that nothing about my exam
    is hidden.
11. As an exam administrator, I want the groups step subtitle to read
    "Remove or Select Groups", so that the wording matches the
    everything-selected starting point.
12. As an exam administrator preparing an exam with a URL, I want all of the
    above to behave identically to the assessment-tool flow, so that the two
    entry points stay consistent.
13. As a developer, I want a single shared implementation of "which fallback
    group applies", so that the exam template table, the groups step, and the
    summaries can never drift apart.

## Implementation Decisions

- **Read-only templates**: the wizard only reads the selected exam template;
  the selection decides which client-group blueprints the backend copies onto
  the new exam. Nothing in this feature writes to templates.
- **Default selection**: initialize to all of the selected template's client
  groups. Reset to "all" exactly when the selected template changes
  (including the first selection); preserve the user's choices otherwise.
- **Empty selection is allowed** (accepted quirk, deliberate decision): the
  backend treats a blank client-group id list as "no filter" and copies all
  template groups. The step must not block on an empty selection; the quirk
  is documented, not guarded against.
- **Fallback group derivation is shared**: a pure helper in the client-group
  utility module derives the fallback group (existence, name, type) from
  screen-proctoring enablement, collecting strategy, and stored group name —
  the same rules the shared client-groups table widget uses today: exists iff
  screen proctoring is enabled; legacy "one group for exam" strategy yields
  the single-group variant; the name falls back to the i18n defaults. The
  synthetic fallback type and its sentinel id move to that module, and the
  table widget consumes the helper so there is exactly one implementation.
- **Fallback data source**: the already-loaded selected template's exam
  attributes (screen proctoring flag, collecting strategy, collecting group
  name). No new fetch, no schema widening. The step's existing screen
  proctoring settings fetch (for the per-group chips) stays untouched.
- **Fallback row presentation**: rendered in the same list as the real
  groups, after them, with a checked and disabled checkbox; not clickable;
  exempt from the search filter; shows its type label like other rows.
- **Step gating unchanged**: the groups step appears only when the template
  has at least one real client group. A screen-proctoring-only template skips
  the step; its fallback group still appears in the summary.
- **Summary**: the client-groups section lists the fallback entry whenever
  the selected template has screen proctoring enabled, regardless of whether
  the groups step was shown. Entry shape matches the existing group entries
  (name + type); no per-group screen proctoring boolean is added.
- **API payload unchanged**: nothing new is sent. Verified empirically on dev
  (2026-08-24): the backend copies the template's screen proctoring settings
  — including the fallback group name — onto the new exam automatically; the
  client-group id list only filters real client groups.
- **i18n**: the groups step subtitle becomes "Remove or Select Groups"
  (English only; the German locale is a stub).

## Testing Decisions

- Project decision: **no unit tests** — verification is typecheck
  (`npx vue-tsc --noEmit` in `client/`) plus browser walkthroughs with
  Playwright MCP against Alain's already-running dev server (login
  `super-admin` / `admin123`). Never start the DB, backend, or containers.
- The one code seam is the shared fallback-derivation helper: pure, argument
  → value, designed so it *could* be unit-tested later without refactoring.
- Browser verification observes external behavior only (rendered rows,
  checkbox states, summary entries, request payloads via the network tab).
- Dev fixtures (kept deliberately):
  - Template 54 "Alain ClientGroups Test" — happy path: groups + screen
    proctoring + fallback group configured.
  - Template 91 "ZZZ SEBSERV-970 id-index probe" — screen proctoring with
    group ids ≠ list positions.
  - Template 22 "test final" — control template whose ids equal positions.
  - Exam 13 "ZZZ SEBSERV-970 probe exam" — reference for the backend's
    automatic screen-proctoring copy.
- Scenarios to walk: default all-selected on template pick; reset on template
  switch; persistence on back/forward; fallback row rendering (checked +
  disabled, last, search-exempt, correct name/type); summary with and without
  a visible groups step; unchanged create payload (`clientGroupIds` only);
  regression pass on the exam template wizard groups table and its summary
  after the shared-helper refactor.
- Delete any `.playwright-mcp/*` artifacts before ending the turn.

## Out of Scope

- The Screen Proctoring chips reading group ids as list positions — tracked
  separately in `.scratch/sp-chip-id-index/issues/01-chip-reads-ids-as-positions.md`.
- Changing the step gating (showing a fallback-only groups step).
- Guarding or changing the backend's blank-selection-copies-all behavior; any
  backend change at all.
- German locale content (stub).
- The retired "one group for exam" write path (see the SEBSERV-973 PRD);
  legacy read/display behavior must keep working through the shared helper.

## Further Notes

- Glossary: "Screen Proctoring Fallback Group" was added to
  `client/CONTEXT.md` during this session — synthetic, display-only, never
  part of client-group selection.
- Backend evidence (public repo + dev probe): exam creation copies template
  client groups filtered by the submitted id list (blank = all), and applies
  the template's screen proctoring settings verbatim, remapping the
  screen-proctored group selection onto the exam's group copies by id/name.
- The wizard stores survive navigation within the session; the reset-on-
  template-change rule is what keeps stale selections out.

## Process

- Work the issues in order. Implement one issue per turn, then stop so Alain
  can review and commit (he commits himself — never run git commit).
- Append a dated "Implemented" comment with verification evidence to each
  issue file when done.
