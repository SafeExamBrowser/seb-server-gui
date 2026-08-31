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

**Status:** ready-for-agent

- [ ] A `Prerequisite` concept exists with a member for Connection
      Configuration, and a shared composable answers whether a given list of
      prerequisites is unmet, resolving each to a resolved/met pair. It is
      the only place that knows which fetch answers which prerequisite.
- [ ] Sources that use the homemade fetch composable are normalised inside
      the seam, with a `TODO @alain` noting they collapse once that
      composable is migrated to TanStack Query. No migration is done here.
- [ ] The navigation item model carries a declarative `requires` list next to
      the existing `visible`, and the navigation section builders stay pure —
      they declare rules, they do not resolve them.
- [ ] A disabled navigation item renders as a non-link label, dimmed with the
      Vuetify opacity utility and with the hover effect suppressed. No custom
      CSS.
- [ ] The info icon button renders only when the item is disabled and has a
      message; it is a real focusable button with an accessible name, it is
      the sole tooltip activator, and the tooltip uses default triggers only.
- [ ] A new top level i18n namespace holds the message and the info button's
      accessible name, English only, full static keys written literally at
      each declaration, no trailing periods.
- [ ] While the check is unresolved, or if it fails or is refused, the link
      behaves exactly as it does today.
- [ ] An institutional administrator account exists in institution 6 for
      verification, and the institution has no active Connection
      Configuration. Username and password are reported in the comment.
- [ ] Browser verification as that user: the link is dimmed and dead, the
      info button is reachable and shows the message, then creating a
      Connection Configuration and returning to the Navigation Overview
      leaves the link live.
- [ ] Browser verification as super administrator in institution 1 (fully
      populated): nothing on the Navigation Overview looks or behaves
      differently.
- [ ] The open backend question is answered: deactivate a Connection
      Configuration and confirm whether the active filter the GUI passes to
      the connection configuration names endpoint is actually honoured — it
      is not in the generated OpenAPI types. Record the answer in the
      comment; if it is ignored, say so plainly, since the exam template
      form's selector is then already listing deactivated ones today.
- [ ] Both glossary terms — Prerequisite, and Assessment Tool Connection as
      the GUI name for the backend's LMS Setup — are added to the client
      context glossary.
- [ ] Typecheck passes (`npx vue-tsc --noEmit` in `client/`).
