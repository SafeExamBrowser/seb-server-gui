# Overview

This repository contains the GUI only. It's split into two subprojects:

- `client/`: Vue 3 + Vuetify SPA (the actual GUI).
- `server/`: Tiny api gateway. It proxies `/api/*` to the different api servers. In prod, it severs the built client.

There is no root `package.json` that orchestrates both. Work in the subdirectory that matches your change. Find the relevant `npm` commands in there.

# Code organisation

This project is in a transition phase. Not all code is organised in the way we want yet. The following instructions win over what you encounter
on the filesystem if they clash:

- We build self contained components. Each component can contain it's own `types.ts`, `components` folder for subcomponents, `composables` etc.
  `client/src/components/views/seb-server/exam-template/wizard/` is a good example.
- Components / composables that are used in several places are stored globally (see `client/src/components` / `client/src/composables`).
  `client/src/components/widgets/breadCrumb/BreadCrumb.vue` is a good example.
- Components / composables should be stored as local as possible, but as global as necessary.

# General instructions

- Don't delete comments in the codebase unless they became irrelevant by your change.
- Prefer the "Vue composition API" over the "Vue options API".
- Use `getRouteName` in `client/src/router/routeNames.ts` when generating URLs.
- Use `client/src/composables/useFetch.ts` and `client/src/composablesuseMutation.ts` and the abstracted API services stored in
  `client/src/services` for data fetching.
- Avoid writing custom CSS. Use Vuetify utility classes whenever possible.
- When writing Pinia Stores, prefer "Setup Stores" over "Option Stores".
  `client/src/components/views/seb-server/exam-template/wizard/composables/useScreenProctoringStore.ts` is a good example.
