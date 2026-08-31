# SEB Server GUI (client)

Vue SPA for administering Safe Exam Browser exams. This glossary pins down the
domain language the GUI uses; backend wire names sometimes differ.

## Language

### Actions

**Prerequisite**:
An entity that must exist before an action becomes available. Not a
permission: an ability (`canView`) answers "may I do this at all" from the
user's role and hides the action when unmet, while a Prerequisite answers "can
I do this yet" from the institution's data and leaves the action visible but
dead. An unresolved, failed or refused prerequisite check counts as met, so
the action behaves exactly as it would without the gate.
_Avoid_: permission, requirement, precondition

**Assessment Tool Connection**:
The GUI name for what the backend calls an LMS Setup. A prerequisite phrased
in Assessment Tool Connections is therefore answered by reading LMS Setup
endpoints.
_Avoid_: LMS setup, LMS connection

### Client groups

**Client Group**:
A named partition of SEB clients, matched by one criterion (IP range, client
OS, or alphabetical name range). The same concept whether it lives on an exam
template or on an exam. An exam's client groups reach it either through the
selection from the template while preparing the exam or by direct creation on
the exam — either way they are detached from the template: no ongoing link, so
edits or deletions on either side never affect the other.
_Avoid_: group (alone), SEB group, client group template (the backend wire
name `CLIENT_GROUP_TEMPLATES` notwithstanding — it's not a distinct concept)

**Screen Proctoring Fallback Group**:
A synthetic, display-only group that exists whenever screen proctoring is
enabled: SEB clients that match no screen-proctored client group are collected
there. Not a Client Group entity — it has no id, cannot be edited, selected,
or deleted, and reaches an exam via the screen proctoring settings copied from
the template, never via client-group selection. Its name comes from the
template's screen proctoring settings; legacy templates with the retired
"one group for exam" strategy show it as their single collecting group.
_Avoid_: collecting group (backend wire name `spsCollectingGroupName`
notwithstanding), fallback client group
