# 08 — Screen proctoring toggle as last form field

**What to build:** In the client-group create/edit form, the screen
proctoring toggle currently renders directly after the group type select,
before the type-dependent fields. Move it so it is always the last field of
the form: name → type → type-dependent fields → screen proctoring toggle.

Settled 2026-08-25 in a grilling session with Alain — decisions below are
final.

**Blocked by:** —

**Status:** done

## Facts (verified in source)

- All three flows (exam detail box, exam-template detail box, exam-template
  create wizard step) share the `clientGroupsTable` widget; the form field
  order is assembled in exactly one place:
  `client/src/components/widgets/clientGroupsTable/composables/useFormFields.ts`.
- `FormFields.vue` renders fields strictly in array order, so moving the
  `useFormFieldsScreenProctoring(...)` entry to the end of the array is the
  whole change.
- When screen proctoring is not allowed for groups the composable returns an
  empty array, so the gating is unaffected by position.
- The table columns (name → type → screen proctoring → actions) have no
  type-dependent columns and stay untouched.

## Decisions

- Single reorder in the shared `useFormFields.ts`; all three flows change
  together, no per-flow split.
- No behavior, i18n, or type changes.

## Acceptance

- [x] For every group type (IP range, client OS, alphabetical name range),
      the screen proctoring toggle renders after the type-dependent fields.
- [x] Verified in the browser in all three flows: exam detail dialog,
      exam-template detail dialog, exam-template create wizard step.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`); no unit tests
      per standing decision.

## Comments

**2026-08-25 — Implemented**

- Moved the `useFormFieldsScreenProctoring(...)` entry to the end of the
  field array in `useFormFields.ts`; no other code changed.
- Verification (dev server, super-admin, accessibility snapshots of the
  dialogs):
  - Exam 11 Add Group dialog: cycled all three types — IP v4 Range
    (name → type → start/end IP → SP toggle), SEB Client OS
    (… → Client OS Type → SP toggle), Alphabetical User Name Range
    (… → start/end letter → SP toggle). Edit Group dialog on the existing
    Client OS group shows the same order.
  - Exam template 54 (SP enabled) Add Group dialog: IP v4 Range order
    confirmed, SP toggle last.
  - Create-wizard step 5 (fresh wizard with SP checked in step 1,
    discarded without creating): Alphabetical User Name Range order
    confirmed, SP toggle last.
  - No data was created or mutated anywhere; every dialog was cancelled.
- `npx vue-tsc --noEmit` clean.

**2026-09-01 — Human-tested by Alain; closed as done.**
