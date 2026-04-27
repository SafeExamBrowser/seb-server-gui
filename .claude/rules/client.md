---
paths:
  - "client/**/*"
---

# Code organisation

This project is in a transition phase. Not all code is organised in the way we want yet. The following instructions win over what you encounter
on the filesystem if they clash:

- We build self contained components. Each component can contain its own `types.ts`, `components` folder for subcomponents, `composables` etc.
  `client/src/components/views/seb-server/exam-template/wizard/` is a good example.
- Components / composables that are used in several places are stored globally (see `client/src/components` / `client/src/composables`).
  `client/src/components/widgets/breadCrumb/BreadCrumb.vue` is a good example.
- Components / composables should be stored as local as possible, but as global as necessary.

# Best practice

- TypeScript: Avoid manual typecasts like `as FooBar`. Properly cast the types and fulfill their requirements.
- Prefer the "Vue composition API" over the "Vue options API".
- Use `getRouteName` in `client/src/router/routeNames.ts` when generating URLs.
- Use `client/src/composables/useFetch.ts` and `client/src/composables/useMutation.ts` and the abstracted API services stored in
  `client/src/services` for data fetching.
- Avoid writing custom CSS. Use Vuetify utility classes whenever possible.
- When writing Pinia Stores, prefer "Setup Stores" over "Option Stores".
  `client/src/components/views/seb-server/exam-template/wizard/composables/store/useScreenProctoringStore.ts` is a good example.
- When dealing with i18n translation keys use `i18n.global.t`, unless you are in a setup function. In templates, always use `$t`
