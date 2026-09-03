# PRD: Exam Detail — client groups rework & screen proctoring setting (SEBSERV-968)

Status: done (all 8 tickets implemented and human-tested; closed 2026-09-01)

Branch: `SEBSERV-968_exam-detail-groups`
Settled 2026-08-24 in a grilling session with Alain — don't relitigate the
decisions below; ask only if the code contradicts them.

## Problem Statement

On the exam detail page, the Groups box is a prototype that no longer matches
how client groups are supposed to work:

- New client groups can only be **copied from the exam template** via a
  popover — they cannot be created freely, and existing ones cannot be edited
  at all (only deleted).
- The groups list hides screen proctoring entirely: there is no screen
  proctoring column, and the Screen Proctoring Fallback Group — which every
  screen-proctored exam has — is invisible, unlike on the exam template
  detail page, the template wizard, and the prepare-exam groups step.
- The exam's screen proctoring on/off setting is not visible anywhere on the
  page, and there is no way to change it — even though the product owner
  wants institutional admins to be able to toggle it.

Administrators managing an exam see a different, poorer picture of the same
Client Group concept than they see everywhere else in the GUI.

## Solution

The Groups box on the exam detail page works like the one on the exam
template detail page, backed by the same shared client-groups table widget:
a plus button opens the add dialog, rows have edit/delete actions, a screen
proctoring column appears when the exam has screen proctoring enabled, and
the Screen Proctoring Fallback Group is shown as a fixed, non-editable row
under the same rules as on the template pages. The copy-from-template popover
disappears — an exam's client groups reach it through the prepare-exam
selection or by direct creation here, always detached from the template.

The exam's BasicSettings box gains a read-only Screen Proctoring row, and its
edit dialog gains a toggle that only institutional admins can actually flip
(enforced via the existing backend-computed GUI ability).

When a new group is added while screen proctoring is enabled, its screen
proctoring flag starts enabled — on every page that uses the shared widget.

## User Stories

1. As an exam administrator, I want to create a new client group directly on
   the exam detail page via a plus button and dialog, so that I am not
   limited to the groups the template happened to define.
2. As an exam administrator, I want to edit an existing client group on the
   exam detail page, so that I can correct a range or rename a group without
   deleting and recreating it.
3. As an exam administrator, I want to delete a client group with a
   confirmation dialog, so that I don't destroy one by misclick.
4. As an exam administrator, I want the groups list to show a screen
   proctoring column when the exam has screen proctoring enabled, so that I
   can see at a glance which groups are proctored.
5. As an exam administrator, I want the screen proctoring column to be absent
   when the exam has screen proctoring disabled, so that the table doesn't
   show irrelevant settings.
6. As an exam administrator, I want the Screen Proctoring Fallback Group to
   appear in the exam's groups list under the same rules as on the template
   pages, so that I see the complete picture of the groups my exam has.
7. As an exam administrator, I want the fallback row to be neither editable
   nor deletable, so that I cannot break the collecting mechanism the
   backend manages.
8. As an exam administrator, I want a newly added group to have its screen
   proctoring flag enabled by default when the exam is screen-proctored, so
   that the common case needs no extra click.
9. As a template administrator, I want the same screen-proctoring-on default
   when adding groups in the template wizard and on the template detail page,
   so that the widget behaves identically everywhere.
10. As an exam administrator on an exam with the retired "one group for exam"
    strategy, I want the groups list to simply show the stored data (the
    collecting group's stored name as the fallback row), so that legacy exams
    remain readable without the GUI trying to fix them.
11. As an exam supporter without the edit-client-groups privilege, I want the
    groups table without plus button or action buttons, so that I get a clean
    read-only view like in the other boxes on the page.
12. As an exam administrator on a finished or archived exam, I want the plus
    button and row actions visible but disabled, so that I understand editing
    is blocked by the exam's status, not by my privileges.
13. As any user of the exam detail page, I want the BasicSettings box to show
    whether screen proctoring is enabled, so that the exam's proctoring state
    is visible at a glance.
14. As an institutional admin, I want a screen proctoring toggle in the
    exam's BasicSettings edit dialog, so that I can enable or disable screen
    proctoring for the exam.
15. As an exam administrator without the screen-proctoring privilege, I want
    to still see the toggle in the edit dialog but disabled, so that the
    dialog matches the box row instead of a setting mysteriously vanishing.
16. As an institutional admin on a finished or archived exam, I want the
    screen proctoring toggle disabled, so that status rules apply to it like
    to every other control.
17. As an exam administrator, I want the fallback row and screen proctoring
    column to update after I add, edit, or delete a group, so that
    backend-derived proctoring state never goes stale on screen.
18. As an exam administrator, I want group create/edit/delete failures
    reported via the usual error notifications, so that I know when a change
    didn't stick.
19. As an exam administrator, I want the groups table to tolerate a malformed
    group record from the backend by omitting that row rather than crashing
    the box, so that one bad record doesn't hide the rest.
20. As a maintainer, I want the exam page to reuse the shared client-groups
    table widget instead of a parallel implementation, so that future fixes
    land everywhere at once.

## Implementation Decisions

- **Reuse via deps adapter.** The exam's Groups box becomes a thin wrapper
  around the shared client-groups table widget (same as the template detail
  page). The exam side adapts at the deps boundary: incoming exam-API groups
  are parsed into the widget's strict client-group shape (the exam wire flag
  `isSPSGroup` maps to the widget's `screenProctoringEnabled`), and the
  create/update/delete deps map back to the exam wire shape (including
  `examId`) before calling the exam-scoped client-group endpoints (which all
  already exist). The widget itself is not generalized.
- **Tolerant parsing.** Adapting an incoming group uses non-throwing schema
  parsing; a row that fails validation is dropped with a console warning
  instead of crashing the box (should never happen for the three known group
  types). Leave a TODO for Andrei: the adapter shrinks once hey-api generated
  ClientGroup types/schemas exist (no TODOs inside the generated api types
  themselves — he reworks those wholesale).
- **Copy-from-template machinery is deleted**: the template-selection
  popover, the copy/load-template parts of the exam groups composable, the
  template-group-to-exam-group converter util, the exam-group type-details
  helper if it ends up consumerless, and all i18n keys that become unused.
  Unused *models* under the hand-written seb-server models folder stay for
  Andrei's sweep.
- **Screen proctoring state comes from the exam's `additionalAttributes`**
  (already fetched with the exam): `enableScreenProctoring` and
  `spsCollectingGroupName`. The exam's additional-attributes type is extended
  minimally with the two optional sps fields. Verified against the dev
  backend: `spsCollectingStrategy` is **never** sent for exams, so a missing
  strategy renders as APPLY_SEB_GROUPS — display only, the same rule the
  template detail page already applies. Legacy EXAM-strategy exams therefore
  show their stored collecting-group name with the generic fallback type
  label ("just show the data, don't fix it"). A possible backend follow-up
  (Andreas) is to include `spsCollectingStrategy` in the exam GET.
- **Fallback row derivation is shared**: a new exam-flavored helper beside
  the existing template-flavored one maps the exam's additional attributes to
  the existing pure fallback-group helper. No duplication of the rules.
- **Access gating** extends the shared widget's deps with an optional access
  contract (hidden/disabled refs); the crud table widget learns to hide the
  plus button and hide/disable row actions accordingly. The exam page feeds
  it from the existing exam-action-access composable with the
  edit-client-groups ability: missing privilege hides controls, exam status
  disables them — identical to the neighboring boxes. Template consumers pass
  nothing and keep today's always-editable behavior (their page is gated as a
  whole by the template-detail component ability).
- **New-group default**: the shared table's empty group starts with the
  screen proctoring flag set to "screen proctoring allowed for groups" (the
  same derived flag that controls the column), for all consumers — exam
  detail, template detail, and template wizard.
- **BasicSettings**: read-only Screen Proctoring row in the exam's
  BasicSettings box, always visible. The edit dialog always contains the
  toggle; it is enabled only when the backend-granted
  edit-screen-proctoring ability is present and the exam status allows it.
  Verified in the backend (development branch): that ability is granted to
  institutional admins only, which is exactly the product owner's rule — no
  GUI role check needed.
- **Persisting the toggle** uses the dedicated exam screen-proctoring
  activation endpoint (query-flag POST), not the full exam update and not the
  settings endpoint (which leaks SPS service credentials — reported to
  Andreas separately). The dialog splits its patch like the template page
  does: SP change goes to the activation endpoint, everything else through
  the normal exam update; the exam is refetched afterwards.
- **Refetch after group mutations**: create/update/delete refetches both the
  groups list and the exam, because group changes mutate backend-derived
  screen proctoring attributes (groups selection, fallback name) — the same
  reason the template page invalidates its whole template query.

## Testing Decisions

Per the standing project decision there are no unit tests for this work. The
verification seams are:

- **Typecheck**: `npx vue-tsc --noEmit` in `client/` must pass after every
  step.
- **Browser verification** against Alain's running dev server
  (super-admin/admin123), exercising external behavior only: exam 11
  (screen proctoring on, APPLY_SEB_GROUPS) for column/fallback/add/edit/
  delete/default-flag; exam 4 (screen proctoring off) for the hidden column
  and off-default; exam 5 (legacy EXAM strategy) for the show-data-as-is
  edge case; a finished/archived exam for the disabled state; the template
  detail page and template wizard as regression for the shared-widget
  changes (access dep absent, new default active).
- Prior art: the browser-verification checklists recorded in the
  prepare-exam-groups issues.

## Out of Scope

- Backend changes: redacting SPS credentials from the screen-proctoring
  settings responses, server-side-enforcing the institutional-admin rule on
  the activation endpoint, and adding `spsCollectingStrategy` to the exam
  GET — all reported to Andreas separately.
- Any cleanup of the hand-written seb-server models beyond the minimal
  additive extension of the exam additional-attributes type (Andrei's
  hey-api migration owns that).
- The prepare-exam groups step and template pages beyond the two shared
  behavior changes they inherit (access dep — unused there — and the new
  screen-proctoring default).
- Reworking how the exam detail page's other boxes gate their controls.

## Further Notes

- The domain glossary was updated in this session: an exam's client groups
  reach it via the prepare-exam selection or direct creation, always
  detached from the template; the copy-from-template wording is gone.
- Security finding for Andreas (discovered during this session): both the
  exam and exam-template screen-proctoring settings GETs return `spsAPIKey`,
  `spsAPISecret`, `spsAccountId`, `spsAccountPassword` in plaintext; the GUI
  never uses them; the OpenAPI spec models the secrets as CharSequence-ish
  objects, so the plaintext serialization looks accidental.
- Backend finding for Andreas (discovered during implementation,
  2026-08-25; root cause confirmed in the backend source, `development`
  branch): the exam client-group POST **and** PUT both ignore `isSPSGroup`.
  `isSPSGroup` is read-only derived state — `ClientGroupDAOImpl.toDomainModel`
  computes it as "a `screen_proctoring_groop` record with this `sebGroupId`
  exists for the exam", while `createNew`/`save` build the DB record without
  any SP data, silently dropping the posted flag (no property-name variant
  binds: `isSPSGroup`, `spsGroup`, `spsgroup` all tested on both verbs,
  JSON and form-encoded, on exams 2 and 11). The links that make the flag
  read `true` are only created by the SP sync
  (`ScreenProctoringAPIBinding`) from `spsSEBGroupsSelection` under
  APPLY_SEB_GROUPS — which is why groups that entered the selection via
  prepare-exam/SP-settings show `true` (exam 2 ids 8/9) even though direct
  create/update of the flag never sticks. **Resolution (settled 2026-08-25
  with Andreas):** the client uses the existing
  `POST /exam/{modelId}/screen-proctoring/apply-groups` endpoint (the
  pre-SEBSERV-958 UI did the same; the refactoring dropped the call) — see
  ticket 07. This is an acknowledged workaround: group mutation plus SP
  application should be one atomic backend operation, and the client
  currently carries too much business logic. Andreas will add a single exam
  groups endpoint later; a `TODO @Andreas` in the adapter marks the
  replacement point.
