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
