# PRD: Exam detail page refactor (SEBSERV-958)

Status: ready-for-agent
Branch: `SEBSERV-958_exam-detail-page`
Mockup: Kristina's screenshot (side panel left, boxes right), original at `~/Desktop/screenshot-3.png` on Alain's machine.

## Context

We rebuild the old `/exam/:id` page from scratch at `/exam-new/:id`, mirroring `exam-template/[id]`, then swap it in and delete the old page (step 8). **One branch, one PR** — the parallel route exists only so each commit stays reviewable. Treat everything under `exam/[id]/` as frozen: it gets deleted wholesale, so don't refactor it.

## Design rules (not obvious from the code)

- **Read-only lookups live in the component** — components self-fetch presentational data derived from entity props; only mutations flow through the page composable's generic `updateExam(patch)`.
- Global reference data (e.g. connection configurations) is fetched **once on mount, gated by the relevant ability**, not refetched per interaction. Accepted trade-off: changes made elsewhere need a page reload to appear.
- The download button gating on `EditSEBSettings` is a quirk ported 1:1 from the old page — intentional, not a bug.
- i18n keys go in `en.json` only, never `de.json`.

## Commit plan

- [x] 1. Scaffold (route, page composable, loading/error/notFound).
- [x] 2. Side panel: read-only top.
- [x] 3. Side panel: action stack.
- [x] 4. Box Basic Settings.
- [x] 5. **Box SEB Settings** — edit icon only (no import/export), opening the shared `SebSettingsDialog`. The role split needs no work here: `SEBSettingsPanel` restricts its own tabs on `EditFullSEBSettings`, so labels stay static ("SEB Settings" / "Edit SEB Settings", "View …" when readonly). Body shows "Last modified by": `ExamConfigurationMap` has no timestamps, but it carries `configurationNodeId`, so the box resolves it and reads `lastUpdateUserName` / `lastUpdateTime` from `GET /configuration-node/{id}` — the same endpoint the exam template box uses. Exams without a config mapping (404) render an empty body.
- [ ] 6. **Box SEB Keys** — pure placeholder (title + edit icon, non-functional). Today's SEB Keys list item is already dead UI, so nothing is lost.
- [ ] 7. **Box Supervisors** — promote the template's `BoxSupervisors` (already dumb) to a shared component used by both pages. `Exam.supporter: string[]` matches the template's field → `updateExam({ supporter: ids })`. `**updateExam` is currently internal to `useExamDetailPage` — export it when wiring this.\*\*
- [ ] 8. **Swap** — delete `src/pages/(app)/exam/[id]/`, move `exam-new/[id]` → `exam/[id]`, delete `stores/seb-server/examStore.ts`, remove now-unused i18n keys and service imports (incl. `examDetail.sidePanel.errors.connectionConfigurationsFailed`, unused since step 3's rework). Keep `examDetail.main.activeSEBClientsNote` — the shared `SebSettingsDialog` uses it. Inbound navigation (4 call sites, all by route name `"/(app)/exam/[id]/"`) needs no changes — the route name is path-derived and identical after the move. Check whether `widgets/ExamTemplateDialog.vue` and the client-group dialogs' shared deps are still referenced elsewhere before deleting.

## Out of scope (explicit)

- Groups box + Apply Screen Proctoring — Alain, later. The temporary loss of both on main after the swap is **accepted**.
- Indicators box — intentionally absent (exam admins use the template's indicators).
- Extended side-panel read-only data (LMS info); new role-based visibility rules — separate issues.
- Tests: no existing coverage of this page; adding e2e is not part of this PR.

## Dev environment

- **Vite dev server**: `npm run dev` in `client/` → :8082, reachable from a sandbox at `host.docker.internal:8082`. Login `super-admin` / `admin123`.
- **Backend + MariaDB** run as pre-existing Docker containers on the host (`seb-server`, `seb-server-demo-mariadb` on :3307, root/admin123) — not reachable from inside a sandbox, so DB steps must be run host-side. Don't trust a bare port check from the sandbox: the proxy accepts any TCP connection, so :3307 looks open but sends no MySQL handshake.
- **DB hacks for exam states** (host): `docker exec seb-server-demo-mariadb mysql -uroot -padmin123 SEBServer`. Detach the exam from the LMS (`lms_setup_id = NULL`) first, or the quiz-data sync reverts hacked times/status within seconds. Setting `status` alone does nothing — the backend derives it from the quiz times and overwrites it; move `quizEndTime` into the past instead. Once detached, the exam counts as "with URL", so the times can be changed through the GUI or a plain `PUT /api/exam` without any DB access.
- **Fixtures currently in dev data**: exam 5 (templated), exam 7 "Demo Quiz 13" (Running), **exam 9 "testttttst" (Finished, detached from LMS)** — the one to use for readonly/view-only cases. Connection configs 1 "test" and 6 "Claude Dialog Test Config" **both active** — keep both, they're what makes the multi-config selection dialog reachable. Still no archived exam.
- **No Exam Admin account exists** (only `super-admin`, `sebserver-admin`, `Testuser`), so the restricted-role paths cannot be exercised in dev.

## Open findings (flagged to Alain, not in this branch's scope)

- With-URL exam create is broken in dev: `POST /api/exam` returns an empty 400 (pre-existing, reproduced via curl).
- The checked-in generated hey-api SDK disagrees with the running backend on the mark-exclude path order — the backend serves `scheduled-delete/mark-exclude/{id}`. Confirm the canonical path with Andreas / regenerate.
- The new GUI has **no activate control** for connection configurations (create saves inactive; the edit page has no toggle). Possibly its own issue.
- `SEBSettingsPanel` opens with no tab selected for the restricted role: `currentTab` defaults to `1`, but that branch's tabs are `2` and `3`. One-line fix (init from the first tab), left alone because the panel is shared with the exam-template page and the wizard. Unconfirmed — needs an Exam Admin account.
- Exam status rules (`examStatusActions` in `services/ability.ts`) are enforced **client-side only**; the backend's ability list is role-based and exam-independent. `undo-changes` returned 200 on a finished exam, so at least that endpoint isn't status-gated server-side. Worth confirming with Andreas whether the backend should enforce them too.

## Verification

- Per commit: browser check against the dev server via Playwright MCP, plus `npx vue-tsc --noEmit`, eslint, prettier.
- After step 8: `/exam/2` serves the new page; exam list row click, archive row action and create-stepper redirect all still land correctly; `npm run build` passes with the store deleted.
- Delete any `.playwright-mcp/*` artifacts afterwards.
