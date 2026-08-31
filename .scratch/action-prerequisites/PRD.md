# PRD: Prerequisites for GUI actions (SEBSERV-997)

Status: ready-for-agent (tickets 01–05 ready-for-agent, none started)

Branch: `SEBSERV-997_ensure_conditional-steps-ready`
Settled 2026-08-31 in a grilling session with Alain — don't relitigate the
decisions below; ask only if the code contradicts them.

## Problem Statement

Several actions in the GUI cannot succeed until other data exists, but the
GUI advertises them anyway. On a fresh installation an administrator sees
"Create Exam Template", "Prepare Exam" and "Prepare Exam with URL" on the
Navigation Overview, clicks one, and lands in a form or wizard whose selector
is empty — with nothing on the page saying what is missing or where to get
it. The same is true of the "Prepare" button on the Exams list and the "Add"
button on the Exam Template list.

The user is not blocked by an error, which would at least be informative.
They are blocked by silence: the action appears available, does nothing
useful, and gives no path forward. Getting a new institution set up therefore
depends on already knowing the intended order of steps.

## Solution

Actions whose data requirements are not yet satisfied stay visible but become
non-interactive, so the GUI stops inviting a click it cannot honour. On the
Navigation Overview, where the user is choosing what to do next, each dead
action carries a small info icon button that states what has to be created
first. Elsewhere — the Exams list and Exam Template list — the button is
simply disabled, because the user is already inside the relevant area and the
Navigation Overview is the place that teaches the order.

As soon as the missing entity is created, returning to the page finds the
action alive again.

## Ubiquitous language

**Prerequisite** — an entity that must exist before an action becomes
available. A Prerequisite is *not* a permission. The GUI now has two distinct
gates on an action, which look similar on screen and must not be conflated:

| Gate | Question | Source | Unmet ⇒ |
| --- | --- | --- | --- |
| Ability (`canView`) | *May I do this at all?* | the user's role | action **disappears** |
| Prerequisite | *Can I do this yet?* | the institution's data | action **stays visible, goes dead, explains itself** |

**Assessment Tool Connection** — the GUI name for what the backend calls an
LMS Setup. Relevant here because a Prerequisite phrased in Assessment Tool
Connections is answered by reading LMS Setup endpoints.

Both terms are added to the client context glossary.

## User Stories

1. As an institutional administrator setting up a new institution, I want
   actions that cannot yet succeed to be visibly non-clickable, so that I
   don't waste time walking into empty forms.
2. As an institutional administrator on the Navigation Overview, I want a
   disabled action to tell me what is missing, so that I know what to do
   next without consulting documentation.
3. As an institutional administrator, I want that explanation to name the
   entity I have to create, so that I can find the right page myself.
4. As an institutional administrator, I want "Create Exam Template" disabled
   until at least one Connection Configuration exists, so that I never reach
   an exam template form with an empty Connection Configuration selector.
5. As an institutional administrator, I want "Prepare Exam" disabled until at
   least one Exam Template exists, so that I never reach a wizard whose
   template step has nothing to choose from.
6. As an institutional administrator, I want "Prepare Exam" disabled until at
   least one Assessment Tool Connection exists, so that I never reach a
   wizard whose assessment tool step has nothing to choose from.
7. As an institutional administrator with neither an Exam Template nor an
   Assessment Tool Connection, I want to be told about **both** at once, so
   that I can plan both steps instead of discovering the second one only
   after finishing the first.
8. As an institutional administrator, I want "Prepare Exam with URL" disabled
   until at least one Exam Template exists, so that the URL flow is gated on
   what it actually needs.
9. As an institutional administrator, I want "Prepare Exam with URL" to
   remain available when no Assessment Tool Connection exists, so that the
   flow whose entire purpose is working without an LMS is not blocked on one.
10. As an administrator on the Exams list, I want the "Prepare" button
    disabled while the exam wizard cannot succeed, so that the list page
    agrees with the Navigation Overview.
11. As an administrator on the Exam Template list, I want the "Add" button
    disabled while no Connection Configuration exists, so that I can't slip
    into the dead end through a side door after the Navigation Overview told
    me it was closed.
12. As an administrator, I want the disabled action to look plainly
    unavailable rather than merely inert, so that I can tell at a glance
    which parts of the page are actionable.
13. As an administrator who has just created the missing entity, I want the
    action to be alive when I come back, so that the GUI rewards me for
    following its advice instead of appearing stuck.
14. As an administrator who created the missing entity in another browser tab
    or had a colleague create it, I want the action to become available on my
    next visit to the page, so that I don't have to reload or wait out a
    cache.
15. As a keyboard user, I want to be able to reach the info icon button and
    read its message without a mouse, so that a dead action is not a dead end
    for me specifically.
16. As a screen reader user, I want the info icon button to have an
    accessible name, so that I understand what it will tell me before
    activating it.
17. As a touch device user, I want tapping the info icon to reveal the
    message, so that the explanation is not mouse-only.
18. As an administrator with a slow connection, I want the actions to behave
    exactly as they do today while the check is still running, so that the
    page never flickers between enabled and disabled states.
19. As an administrator, I want a failed prerequisite check to leave the
    action available rather than disabled, so that a transient network
    problem never tells me to create something I already have.
20. As an administrator whose Connection Configurations are all deactivated,
    I want "Create Exam Template" disabled, so that the gate agrees with the
    form's selector, which offers only active ones.
21. As an administrator whose Assessment Tool Connections are all
    deactivated, I want "Prepare Exam" disabled, so that the gate agrees with
    the wizard's step, which offers only active ones.
22. As a less privileged user who can see a gated action but not the
    prerequisite entity type, I want the same explanation everyone else gets,
    so that I know what to ask my institutional administrator for.
23. As an administrator whose institution is fully set up, I want no visible
    change anywhere, so that this feature is invisible in normal operation.
24. As a developer adding a new navigation item, I want the prerequisite
    rules declared next to the visibility rules, so that I can see the
    mechanism exists without reading the pages that render the items.
25. As a developer, I want one place that answers "is this prerequisite
    satisfied", so that the Navigation Overview, the Exams list and the Exam
    Template list can never disagree with each other.

## Implementation Decisions

### The rules

| Action | Site | Prerequisites | Message |
| --- | --- | --- | --- |
| Create Exam Template | Navigation Overview | ≥1 Connection Configuration | yes |
| Prepare Exam | Navigation Overview | ≥1 Exam Template **and** ≥1 Assessment Tool Connection | yes |
| Prepare Exam with URL | Navigation Overview | ≥1 Exam Template | yes |
| Prepare | Exams list | ≥1 Exam Template **and** ≥1 Assessment Tool Connection | no — silent |
| Add | Exam Template list | ≥1 Connection Configuration | no — silent |

"Prepare Exam with URL" deliberately does **not** require an Assessment Tool
Connection: the URL flow exists to prepare an exam without an LMS, and its
wizard never fetches assessment tools.

### What "at least one" means

At least one *usable* entity, where usable is defined as "whatever the target
flow itself would offer":

- Connection Configuration — **active only**
- Assessment Tool Connection — **active only**
- Exam Template — plain existence (the entity has no active flag)

The consequence is accepted: an institution whose only Connection
Configuration is deactivated sees "You need to create a Connection
Configuration first", when reactivating would also do. A gate that agrees
with the form it guards is worth more than that wording nuance.

### State model

A single boolean per action:

```
disabled = prerequisite check has resolved AND at least one prerequisite is unmet
```

Every other state — still loading, request failed, request refused with 403 —
counts as ready, so the action behaves exactly as it does today. This was
chosen over the alternatives on purpose:

- **Not** disabled-while-loading: on a fresh installation, where every
  prerequisite is genuinely unmet, that would flash every affected action
  from enabled to disabled on each cold load — the population this feature
  serves would see the most jank.
- **Not** enabled-looking-but-inert while loading: an element that invites a
  click and silently swallows it is worse than one that works.
- **Not** fail-closed on error: a network blip must never fabricate "you need
  to create X first", a message the user cannot retry past.

The residual risk is that a very fast click during the in-flight window
reaches the dead end. That is today's behaviour, not a regression, and the
window is one small request wide.

Note the page already pops content in on cold load — abilities arrive by
query, and until they do `canView` is false for everything, so nav items are
hidden. Firing the prerequisite checks alongside means readiness is typically
known by the time any item is clickable at all.

### Where the rule lives

The navigation item model gains a declarative `requires` list alongside the
existing `visible`, so the two gates sit side by side as data and the
navigation section builders stay pure — they declare rules, they do not
resolve them. This keeps the settings pill bar and the Navigation Overview,
which already share a builder, from drifting the day a settings item gains a
prerequisite.

### The single seam

One shared composable owns prerequisite resolution for the whole app. It maps
each `Prerequisite` to a resolved/met answer, and is the only place that
knows which endpoint answers which prerequisite. The Navigation Overview, the
Exams list and the Exam Template list all consume it; nothing else computes
readiness. Its shape:

```
Prerequisite = CONNECTION_CONFIGURATION | EXAM_TEMPLATE | ASSESSMENT_TOOL_CONNECTION

useActionPrerequisites() -> {
  isUnmet(requires: Prerequisite[]): boolean          // resolved AND something missing
  unmet(requires: Prerequisite[]): Prerequisite[]     // for message assembly
}
```

### Data sources

Reuse what the guarded flows already call, so a gate can never disagree with
the form or step behind it. No new API surface:

- Connection Configuration — the same active-names fetch the exam template
  form's selector uses.
- Assessment Tool Connection — the same active LMS setup fetch the exam
  wizard's assessment tool step uses. Chosen over the LMS setup *names*
  endpoint, which has no documented way to express "active".
- Exam Template — the exam template *names* fetch. The wizard itself pulls a
  full 500-row page, but templates have no active flag, so both are empty
  under exactly the same conditions and names is far lighter.

Two of these use the project's homemade fetch composable and one uses
TanStack Query. They are normalised to a common resolved/met shape inside the
seam, with a `TODO @alain` noting they collapse once the fetch composable is
migrated to TanStack Query. **No migration happens in this work.**

### Freshness

The Exam Template query opts out of the project's 30 second `staleTime` with
`staleTime: 0`. `staleTime` is per observer, so other consumers of the same
query key keep the project default and merely receive the fresher value. The
other two sources refetch on mount already.

Chosen over invalidating on mutation: readiness changes on create, delete,
activate and deactivate across three entity types, which is a dozen mutation
sites to keep in sync and still blind to changes made in another tab. There
is precedent — the exam wizard already force-refetches assessment tools on
every mount for the same reason.

### The info icon button

- Rendered only when the action is disabled **and** the site defines a
  message. Never while loading, never on a live action, never on the two
  silent buttons.
- A real focusable icon button with an accessible name — the disabled item is
  no longer a link and is therefore out of the tab order, making this the
  only thing a keyboard user can reach to find out why.
- Activates a tooltip using its **default triggers only**: hover and focus.
  Click-to-open is deliberately not enabled, because the tooltip's click
  handler is a blind toggle — with hover also on, clicking would close the
  tooltip that hovering just opened. Touch is covered regardless, since a tap
  synthesises the hover event.
- The icon alone is the activator, not the whole row.

### Messages

English only, in a new top level i18n namespace, with full static keys
written literally at each declaration so the unused-key sweep can find them.
No trailing periods.

| Situation | Message |
| --- | --- |
| Exam template blocked | You need to create a Connection Configuration first, before creating an Exam Template |
| Prepare exam blocked on template | You need to create an Exam Template first, before preparing an Exam |
| Prepare with URL blocked on template | You need to create an Exam Template first, before preparing an Exam with URL |
| Prepare exam blocked on tool | You need to create an Assessment Tool Connection first, before preparing an Exam |

When an action has several unmet prerequisites, **all** applicable messages
are shown, stacked. Showing only the first would mean the user creates an
Exam Template, returns, and is confronted with a second demand they were
never warned about — on precisely the journey this feature exists to smooth.

The last message was reworded from the phrasing in the original request to
match the pattern of the other three, so the two-message case reads as
parallel sentences.

### Visual treatment

The disabled navigation item renders as a non-link label dimmed with the
Vuetify opacity utility, with the hover effect suppressed via a minimal
change to `NavigationItem.vue`'s existing scoped style block — the hover
effect is custom CSS there already, and its class also carries base layout,
so suppression cannot be done with utilities alone. No new style blocks, no
inline styles. The two buttons use their component's existing disabled prop.

## Testing Decisions

This project does not currently write unit tests; features are verified by
type checking plus manual browser verification against the dev server. That
convention holds here.

A good check tests external behaviour: what an administrator sees and can
click on a page in a given data state — never which query fired or how
readiness is represented internally. Should tests be introduced later, the
shared prerequisite composable is the seam to aim at: it is the only module
that maps prerequisites to answers, it has no rendering concerns, and driving
it with empty and non-empty responses covers every rule in the table above.

Verification for this work runs against institution 6 on the dev server,
which Alain has cleared for destructive use. Institution 6 is wholly
disposable test data, exam 17 included — existing entities may be
deactivated or deleted outright to produce the empty state, and nothing
needs restoring afterwards; issue 05 only asks for a report of what was
done. An institutional administrator
account is created there so the checks resolve against an institution the
test user actually belongs to — the endpoints derive the institution from the
current user, so being super administrator in institution 1 cannot observe
another institution's empty state.

Verification covers, at minimum:

- every action disabled with the right message in an empty institution
- both messages present for "Prepare Exam" when both prerequisites are unmet
- "Prepare Exam with URL" gated on Exam Template alone
- the transition: create a Connection Configuration, return, action alive
- the fully-populated institution showing no change at all
- the info button reachable and readable by keyboard
- typecheck clean

Stubbed responses are used only for the failed-request path, which cannot be
produced from real data.

This run also settles an open question about the backend: the active filter
the GUI passes to the connection configuration names endpoint is **not** in
the generated OpenAPI types, which declare only an institution parameter. If
the backend ignores it, then "active only" silently degrades to "any" — and,
more importantly, the exam template form's selector is already listing
deactivated Connection Configurations today. Deactivating one and re-reading
the list answers it.

## Out of Scope

- **Deep links.** Typing a wizard URL, or reaching it from a bookmark or
  history, is not blocked. A readiness-based route guard would have to
  resolve asynchronously before navigating, reintroducing the loading and
  error states the state model deliberately eliminates, and "fail open" in a
  guard means a guard that sometimes does nothing. If the bookmarked dead end
  matters later, the fix is an empty state on the wizard step itself.
- **Migrating the two homemade fetches to TanStack Query.** Tracked
  separately by Alain; this work leaves a TODO where they meet.
- **Reactivation wording.** The message says "create" even when reactivating
  an existing deactivated entity would satisfy the prerequisite.
- **New prerequisite rules** beyond the five in the table.
- **German translations.** The German locale covers a small fraction of the
  English keys; recent features have shipped English only.
- **An ADR.** The one surprising decision — unknown counts as ready — is a
  single boolean to flip, so it fails the hard-to-reverse test. It is
  recorded here instead.

## Further Notes

The prerequisite for a less privileged user is evaluated and messaged
identically, even when they cannot view the prerequisite entity type at all.
Alain confirmed no real role has that split today; if one appears, such a
user reads the message and asks an institutional administrator, which is the
correct outcome.
