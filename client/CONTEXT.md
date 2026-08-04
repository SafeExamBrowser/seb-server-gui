# SEB Server GUI (client)

Vue SPA for administering Safe Exam Browser exams. This glossary pins down the
domain language the GUI uses; backend wire names sometimes differ.

## Language

### Client groups

**Client Group**:
A named partition of SEB clients, matched by one criterion (IP range, client
OS, or alphabetical name range). The same concept whether it lives on an exam
template or on an exam: a template's client groups serve as blueprints, and
copying one onto an exam creates a detached client group there — no ongoing
link, so edits or deletions on either side never affect the other. An exam's
client groups exist only by being copied from its template.
_Avoid_: group (alone), SEB group, client group template (the backend wire
name `CLIENT_GROUP_TEMPLATES` notwithstanding — it's not a distinct concept)
