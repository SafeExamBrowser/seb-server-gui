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
