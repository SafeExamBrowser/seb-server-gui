# 01 — Prerequisite seam and the Create Exam Template rule

**What to build:** On the Navigation Overview, "Create Exam Template" stays
visible but is dimmed and non-clickable while the institution has no active
Connection Configuration, and carries a small info icon button that reveals
"You need to create a Connection Configuration first, before creating an Exam
Template". Once an active Connection Configuration exists, the link is a
normal link again on the next visit to the page. Everything else on the page
is untouched.

This is the tracer bullet: it establishes the whole mechanism — the
Prerequisite concept, the one composable that answers prerequisites, the
declarative rule on the navigation item model, and the disabled rendering
with its info button — and proves it on a single rule.

Follow the decisions in `../PRD.md`; they are settled. In particular: unknown
counts as ready (a check that is still loading, failed, or was refused leaves
the action working exactly as today), the tooltip uses its default hover and
focus triggers with no click trigger, and the Connection Configuration answer
comes from the same active-names fetch the exam template form's selector
already uses.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] A `Prerequisite` concept exists with a member for Connection
      Configuration, and a shared composable answers whether a given list of
      prerequisites is unmet, resolving each to a resolved/met pair. It is
      the only place that knows which fetch answers which prerequisite.
- [x] Sources that use the homemade fetch composable are normalised inside
      the seam, with a `TODO @alain` noting they collapse once that
      composable is migrated to TanStack Query. No migration is done here.
- [x] The navigation item model carries a declarative `requires` list next to
      the existing `visible`, and the navigation section builders stay pure —
      they declare rules, they do not resolve them.
- [x] A disabled navigation item renders as a non-link label, dimmed with the
      Vuetify opacity utility and with the hover effect suppressed via a
      minimal change to `NavigationItem.vue`'s existing scoped style block.
      No new style blocks, no inline styles.
- [x] The info icon button renders only when the item is disabled and has a
      message; it is a real focusable button with an accessible name, it is
      the sole tooltip activator, and the tooltip uses default triggers only.
- [x] A new top level i18n namespace holds the message and the info button's
      accessible name, English only, full static keys written literally at
      each declaration, no trailing periods.
- [x] While the check is unresolved, or if it fails or is refused, the link
      behaves exactly as it does today.
- [x] An institutional administrator account exists in institution 6 for
      verification, and the institution has no active Connection
      Configuration. Institution 6 is disposable test data, exam 17 included
      — deactivate or delete whatever stands in the way of the empty state.
      Username and password are reported in the comment.
- [x] Browser verification as that user: the link is dimmed and dead, the
      info button is reachable and shows the message, then creating a
      Connection Configuration and returning to the Navigation Overview
      leaves the link live.
- [x] Browser verification as super administrator in institution 1 (fully
      populated): nothing on the Navigation Overview looks or behaves
      differently.
- [x] The open backend question is answered: deactivate a Connection
      Configuration and confirm whether the active filter the GUI passes to
      the connection configuration names endpoint is actually honoured — it
      is not in the generated OpenAPI types. Record the answer in the
      comment; if it is ignored, say so plainly, since the exam template
      form's selector is then already listing deactivated ones today.
- [x] Both glossary terms — Prerequisite, and Assessment Tool Connection as
      the GUI name for the backend's LMS Setup — are added to the client
      context glossary.
- [x] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).

---

**2026-08-31 — Implemented**

- Seam: `client/src/composables/useActionPrerequisites.ts` holds the
  `Prerequisite` enum (`CONNECTION_CONFIGURATION` for now) and normalises each
  source into a `{ resolved, met }` pair; `isUnmet` / `unmet` are the only
  readiness answers in the app. `resolved` is "the fetch produced data", so
  loading, network failure and 403 all leave the action live. The `TODO @alain`
  about the homemade `useFetch` collapsing into TanStack Query sits on the
  composable.
- Rule declaration: `NavigationSectionItem` gained `requires` and
  `prerequisiteMessages` (full static i18n keys written literally at the
  declaration in `navigationSections.ts`); the builders stay pure. The
  Navigation Overview page resolves them into `disabled` / `unmetMessages`,
  which `NavigationSection` passes through to `NavigationItem`.
- Rendering: a disabled item renders as a `<span>` with Vuetify's `opacity-50`;
  hover is suppressed by narrowing the two existing `.nav-hover:hover`
  selectors to `.nav-hover:not(.nav-disabled):hover` — no new style rules. The
  info button is a real `v-btn` with `aria-label`, activator of a `v-tooltip`
  on default triggers only.
- i18n: new top level `actionPrerequisites` namespace (English only).
- Glossary: Prerequisite and Assessment Tool Connection added to
  `client/CONTEXT.md`.

Verification (dev server, Playwright):

- Institution 6 already had an institutional administrator:
  **`test-exam-admin` / `Admin-Test-2026!`** (roles EXAM_ADMIN,
  EXAM_SUPPORTER, INSTITUTIONAL_ADMIN). No new account was needed. The
  institution had zero Connection Configurations to begin with.
- As that user with no Connection Configuration: "Create Exam Template" is a
  dimmed non-link, the info button is reachable by Tab from "User Accounts"
  (it is the only focusable element on the item), exposes the accessible name
  "Why this action is unavailable", and focus alone opens the tooltip reading
  "You need to create a Connection Configuration first, before creating an
  Exam Template". Hover shows the same.
- Created "Prereq Verification Config" (id 7) — the backend creates
  Connection Configurations **inactive**, so this also covered the
  active-only rule: with an inactive-only institution the link stayed dead.
  Activating it and returning to the Navigation Overview left the link live
  again; it was deactivated afterwards to restore the empty state for the
  remaining tickets.
- As super-admin in institution 1 (2 active, 3 inactive Connection
  Configurations): the Navigation Overview is unchanged, the link is a normal
  link.
- **Open backend question answered: the `active` filter IS honoured.** On
  institution 1, `GET /client_configuration/names?active=true` returned the 2
  active ones, `?active=false` the 3 inactive ones, and the unfiltered call
  all 5. The parameter is simply missing from the generated OpenAPI types —
  the exam template form's selector is correct today.
- `npx vue-tsc --noEmit`, eslint and prettier clean.
