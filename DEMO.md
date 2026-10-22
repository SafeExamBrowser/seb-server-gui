# AI Assistant PoC — Demo Guide

Branch: `spike/ai-assistant`. Everything is behind the gateway env var
`AI_ASSISTANT_ENABLED` (default `false` — with it off the GUI is unchanged).

## 1. Start the stack

### SEB Server backend (for the live "running exams" look-up)

Use the e2e profile of the `seb-server` backend (Flyway e2e seed, login
`testmain` / `testmain`), e.g. your usual docker-compose dev setup on port 8080.
Without a backend everything still works except the
"Which of my exams are running right now?" question (it answers with the error state).

### Gateway

```bash
cd server
npm install
cat >> .env <<'EOF'
AI_ASSISTANT_ENABLED=true
AI_MOCK=true
EOF
npm run dev          # port 3001
```

`AI_MOCK=true` gives deterministic answers without any model — the whole demo
script below works with it. For real model answers see section 3.

### Client

```bash
cd client
npm install
npm run dev          # port 8082, proxies /api to the gateway
```

## 2. Demo script (~10 min)

1. Log in at `http://localhost:8082` as `testmain` / `testmain`.
2. Point at the header: new **Assistant** button next to the profile menu
   (only there because `AI_ASSISTANT_ENABLED=true`). Click it: a 384 px panel
   docks right and pushes the page content. Welcome state: "You are chatting
   with an AI" + three suggested questions.
3. **Question 1** — "What does the quit password do?": answer built from the
   in-app help texts, with the help-text keys as source chips
   (`sebserver.exam.form.quitpwd.tooltip`, …).
4. **Question 2** — "Which of my exams are running right now?": the gateway
   calls `GET /monitoring` + `GET /monitoring/overview/{id}` on SEB Server
   **with the logged-in user's own bearer token**; the calls made are listed
   under the answer.
5. **Question 3** — "How do I create an exam?": the answer carries a
   **Show me** button. Click it: a guided click-path (driver.js) highlights
   (1) Exams in the nav rail, (2) the prepare button on the exams list,
   (3) the assessment-tool select in the wizard, (4) the wizard next button —
   with ring, numbered callout and Back / Next. It navigates between pages
   itself; the panel stays open.
6. Click **thumbs-down** on an answer → short "Thanks for the feedback" state,
   then show the log:

   ```bash
   cat server/assistant-feedback.jsonl
   ```

7. Flip the flag off (`AI_ASSISTANT_ENABLED=false`, restart gateway, reload):
   button and panel are gone, all `/api/assistant/*` routes answer 404.

## 3. Running a real model

The gateway speaks the OpenAI chat-completions protocol with one tool
(`list_running_exams`). **Recommended: Ollama with `qwen2.5:7b-instruct`** —
free, local, OpenAI-compatible, solid tool calling at 7B, runs comfortably on
an M-series Mac.

```bash
brew install ollama            # or download from https://ollama.com
ollama serve                   # if not already running as a service
ollama pull qwen2.5:7b-instruct
```

Then in `server/.env` (and restart the gateway):

```bash
AI_ASSISTANT_ENABLED=true
AI_MOCK=false
AI_API_BASE_URL=http://localhost:11434/v1
AI_MODEL=qwen2.5:7b-instruct
# AI_API_KEY not needed for Ollama
```

Any other OpenAI-compatible endpoint works the same way, e.g.:

```bash
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-…
AI_MODEL=gpt-4o-mini
```

If the model endpoint is unreachable or errors, the gateway automatically
falls back to the deterministic mock answers.

## 4. Env vars (server/.env — see server/.env.example)

| Var | Default | Meaning |
| --- | --- | --- |
| `AI_ASSISTANT_ENABLED` | `false` | Master switch; off = GUI unchanged, routes 404 |
| `AI_MOCK` | `false` | Deterministic canned answers, no model needed |
| `AI_API_BASE_URL` | – | OpenAI-compatible endpoint; unset = mock answers |
| `AI_API_KEY` | – | Bearer key for the endpoint (omit for Ollama) |
| `AI_MODEL` | – | Model name sent to the endpoint |

## 5. Tests

```bash
cd client
npx playwright test tests/e2e/11-assistant --project=chromium
```

The specs mock the backend **and** the assistant routes, so they need no
gateway, no model and no SEB Server — only the Vite dev server on 8082.

## 6. Known limitations

- Knowledge retrieval is plain keyword scoring over `messages.properties` +
  `en.json` (top 40 entries) — no embeddings; niche phrasing can miss.
- The model is instructed to cite `[[source:KEY]]`; small models sometimes
  cite sloppily, in which case chips may be missing on real-model answers.
- Two guides (`create-exam`, `connect-moodle` — try "How do I connect a
  Moodle?"), one live look-up (`list_running_exams`).
- Answers are not streamed (one response per question).
- The context line shows raw role names (no translated labels).
- `/monitoring` rows whose status isn't `RUNNING` are filtered out of the
  look-up answer.
- Conversation history sent to the model is capped at the last 6 messages;
  "New conversation" resets it.
