# Overview

This repository contains the GUI only. It's split into two subprojects:

- `client/`: Vue 3 + Vuetify SPA (the actual GUI).
- `server/`: Tiny api gateway. It proxies `/api/*` to the different api servers. In prod, it severs the built client.

There is no root `package.json` that orchestrates both. Work in the subdirectory that matches your change. Find the relevant `npm` commands in there.

# Best practice

- Don't delete comments in the codebase unless they became irrelevant by your change.
