# AI Assistant PoC — Progress Log

Branch: `spike/ai-assistant` (created from `development`).

## 2026-10-22 — Piece 0 · Setup

- Created branch `spike/ai-assistant` from `development`.
- `npm install` ran clean in both `client/` and `server/`.
- Read `.claude/rules/client.md`, `ContainerHeader.vue`, `ContainerLayout.vue`,
  `server/src/index.ts`, `server/src/utils/env.ts`, `tests/e2e/shared/mocks/mock-backend.ts`.

### Assumptions / deviations so far

- **Design handoff unreachable.** The link
  `https://claude.ai/code/artifact/15fd6b22-08f7-47cb-9dec-58967372fbd0` is a JS-rendered
  design canvas; its content loads dynamically from claude.ai and is not retrievable with
  the tools available in this unattended session (Docs API denies access, DesignSync needs
  an interactive `/design-login`). Following the layout description in the task instead,
  as instructed.
- **`../seb-server` not checked out.** Downloading `messages.properties` from
  `https://raw.githubusercontent.com/SafeExamBrowser/seb-server/development/src/main/resources/messages.properties`.
- Pre-existing dirty working-tree entries (`.claude/skills/*`, `github/deploy-auto-testing.sh`,
  untracked `Claude outputs/`, `client/.claude/`, `github/.claude/`, `docs/e2e-testing-architecture.drawio`)
  are left untouched and excluded from all commits (targeted `git add` only).
- No model endpoint configured yet (user note). Everything is verified in `AI_MOCK=true`
  mode; DEMO.md will include a suggested model + how to run it.

## 2026-10-22 — Piece 1 · Gateway service

- Added to `server/src/utils/env.ts`: `AI_ASSISTANT_ENABLED` (default false),
  `AI_API_BASE_URL`, `AI_API_KEY`, `AI_MODEL` (optional), `AI_MOCK` (default false);
  documented in `server/.env.example`.
- New `server/src/assistant/`: `knowledge.ts` (loads `server/data/messages.properties` +
  `client/src/i18n/locales/en.json` → 4150 entries, HTML stripped, keyword scoring with
  key-match boost, top 40), `sebServerLookup.ts` (GET `/monitoring?page_size=50` +
  `/monitoring/overview/{id}` with the caller's own `Authorization` header),
  `chat.ts` (system prompt, OpenAI-compatible call with `list_running_exams` tool,
  mock mode, `[[guide:…]]`/`[[source:…]]` parsing), `router.ts` (config/chat/feedback,
  `express.json({limit:"1mb"})` scoped to the router, 404 when disabled).
- Mounted at `/api/assistant` in `server/src/index.ts` before the `/api` proxy.
- Feedback appended to `server/assistant-feedback.jsonl` (gitignored).
- `npm run build` passes.

### Assumptions (Piece 1)

- `/monitoring` rows with a `status` other than `RUNNING` are filtered out (the mocked
  e2e backend returns all exams on `/monitoring`; the real endpoint serves running exams).
- Model is asked to cite with `[[source:KEY]]` markers; verbatim entry keys appearing in
  the answer are also picked up as sources.
- Model fallback: any model error falls back to the deterministic mock answers.

### Verification (curl, `AI_MOCK=true`, stub SEB backend on 127.0.0.1:18080)

```
GET /api/assistant/config
{"enabled":true}

POST /api/assistant/chat  "What does the quit password do?"
{"answer":"The quit password protects leaving the exam: if it is set, a SEB user must
enter it to be able to quit SEB.\nIt mirrors the Quit Password from the SEB settings,
so supervisors can end sessions without students quitting on their own.",
"sources":["sebserver.exam.form.quitpwd.tooltip",
"sebserver.clientconfig.form.hashedQuitPassword.tooltip"],"calls":[]}

POST /api/assistant/chat  "Which of my exams are running right now?"
{"answer":"1 exam(s) are running right now:\n- e2e-getall-exam-03 (8 active of 12
connected clients)","sources":[],
"calls":["GET /monitoring?page_size=50","GET /monitoring/overview/9203"]}

POST /api/assistant/chat  "How do I create an exam?"
{"answer":"To create an exam you import a quiz from a connected assessment tool: open
Exams, start the preparation wizard, pick the quiz and follow the steps.\nI can walk
you through it on the page.","sources":[],"guide":"create-exam","calls":[]}

POST /api/assistant/feedback → 204
{"timestamp":"2026-10-22T14:28:20.665Z","rating":"down","question":"q","answer":"a"}

AI_ASSISTANT_ENABLED=false → GET /api/assistant/config → 404
```

## 2026-10-22 — Piece 2 · Panel in the GUI

- New `client/src/components/assistant/`: `AssistantPanel.vue`, `AssistantMessage.vue`,
  `assistantService.ts` (axios instance → bearer token sent), `types.ts`,
  `composables/useAssistantStore.ts` (Pinia setup store: enabled/open/messages/loading/error).
- `ContainerLayout.vue` loads `/api/assistant/config` on mount; with `enabled:false`
  (or 404 when the flag is off) nothing new renders.
- "Assistant" button (icon + label) in `ContainerHeader.vue` next to the profile menu,
  `data-testid="assistant-open-button"`, only rendered when enabled.
- Panel is a 384 px right-hand flex column in `ContainerLayout.vue` that pushes the page
  content, `data-testid="assistant-panel"`. Header (icon, "Assistant", AI chip, context
  line, new conversation, close), welcome state with the three suggested questions,
  message list, textarea footer with the disclaimer line.
- Answers show text with preserved line breaks, "Sources" chips
  (`assistant-source-chip`), the SEB Server calls made, thumbs up/down
  (`assistant-thumbs-up`/`-down`) with a "Thanks for the feedback" state.
- All strings under `assistant.*` in `en.json` (static keys only).
- Roles in the context line are shown as raw role names: the existing translated-role
  helper uses a template-literal i18n key, which `.claude/rules/client.md` forbids.

### Verification (Piece 2)

- `npm run typecheck:app`, `lint:check:all`, `prettier:check:all`, `test:unit`
  (24 tests) all pass in `client/`.
- Browser check via Playwright MCP against the Vite dev server (8082) + gateway in
  `AI_MOCK=true` (3001) + a stub SEB backend (18080): login, open panel, all three
  suggested questions answered (sources chips, monitoring calls listed, guide answer),
  thumbs-down wrote a line to `server/assistant-feedback.jsonl` and shows the thanks
  state. Screenshot: `docs/assistant-poc/assistant-panel.png`.

## 2026-10-22 — Piece 3 · Guide

- Added `driver.js@1.10.2` (exact pin) to `client/`.
- `client/src/components/assistant/guides.ts`: `create-exam` guide with 4 steps:
  nav rail Exams (`layout-exam-button`), prepare button on the exams list
  (`exams-add-button`), assessment-tool select in the first wizard step, wizard next
  button. New stable testids added (noted): `create-exam-assessment-tool-select` on the
  `v-select` in `StepAssessmentTool.vue`, `stepper-next-button` on the next/save button
  in the shared `StepperFooterActions.vue`.
- `composables/useAssistantGuide.ts`: starts driver.js with ring + "n · title" badge in
  the callout, Back/Next/Done, `showProgress` ("1 of 4"). Before each step the target
  element is awaited; if missing, the step's route is pushed via `typedTo` first.
- "Show me" button (`assistant-show-me-button`) on answers whose `guide` matches a
  known guide. The panel stays open while the guide runs.
- Context line fallback: pages without `meta.titleKey` (e.g. the create wizard) show
  `route.path` instead of the internal route name.

### Verification (Piece 3)

- Browser (Playwright MCP, mocked stack): asked "How do I create an exam?", clicked
  "Show me", stepped 1→4: step 1 highlights the nav entry on any page, Next navigates
  to `/exam`, then `/exam/create`, step 4 highlights the wizard next button, Done closes.
  Panel stayed open throughout. Screenshot: `docs/assistant-poc/assistant-guide.png`.
- `typecheck:app`, `lint:check:all`, `prettier:check:all`, `test:unit` still pass.
