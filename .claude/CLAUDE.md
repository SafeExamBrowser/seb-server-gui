# Overview

This repository contains the GUI only. It's split into two subprojects:

- `client/`: Vue 3 + Vuetify SPA (the actual GUI).
- `server/`: Tiny api gateway. It proxies `/api/*` to the different api servers. In prod, it serves the built client.

There is no root `package.json` that orchestrates both. Work in the subdirectory that matches your change. Find the relevant `npm` commands in there.

# Best practice

- Don't delete comments in the codebase unless they became irrelevant by your change.

# Agent skills

## Issue tracker

Issues and PRDs live as markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

## Triage labels

Canonical defaults (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

## Domain docs

Multi-context layout: `CONTEXT-MAP.md` at the root points to per-subproject `client/CONTEXT.md` and `server/CONTEXT.md`. See `docs/agents/domain.md`.
