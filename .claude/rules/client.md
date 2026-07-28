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

- TypeScript:
  - Avoid manual typecasts like `as FooBar`. Properly cast the types and fulfill their requirements.
  - Don't use `any`.
  - Use `undefined`. Do not use `null`.
  - Prefer the optional shorthand `param?: T` over `param: T | undefined` (for function parameters and object fields).
    Order function parameters so optional ones come last, instead of widening an optional to `| undefined`.
  - Avoid explicitly stating types (e.g. when defining a variable, as return values of functions or when using generics),
    if they can be automatically derived.
- Coding Style:
  - Prefer early returns over nested `if` conditions.
  - Avoid one lined if conditions. If conditions should always be multi line and use brackets.
  - Avoid inline event handlers like `@change="(id) => fooBar(id)" in the template`. Prefer a named event handler like `const handleChange = ...`
    in the component setup.
  - Event handlers should always be prefixed with `handle`, e.g. `handleChange`
- Don't start component names with `V`. This is reserved for Vuetify by convention.
- Prefer the "Vue composition API" over the "Vue options API".
- Routing: when generating urls for Vuetify components with a `to` property (e.g. `v-list-item`, `v-btn`, ...), you
  must always use the `typedTo` helper function so type safety is ensured.
- Use `client/src/composables/useFetch.ts` and `client/src/composables/useMutation.ts` and the abstracted API services stored in
  `client/src/services` for data fetching.
- Avoid writing custom CSS. Use Vuetify utility classes whenever possible.
- Comments:
  - Make sure, existing comments are updated when the underlying code is updated
  - Only delete existing comments if they became irrelevant by a code change
  - Only add new comments if absolutely needed. The code must be easy to read and self documenting.
- When writing Pinia Stores, prefer "Setup Stores" over "Option Stores".
  `client/src/components/views/seb-server/exam-template/wizard/composables/store/useScreenProctoringStore.ts` is a good example.
- i18n:
  - Use `i18n.global.t`; only `<script setup>` may use `useI18n()`; templates use `$t`.
  - Every en.json key must appear verbatim in `client/src` — grep-based unused-key sweeps delete
    keys they can't find. So: no template-literal keys (`$t("supervisors.title")`, never
    `$t(`${prefix}.title`)`), no prefix props or prefix-baking `t` wrappers (components take full
    keys or translated strings), and for runtime values use a `Record<Value, string>` of full
    static keys (see `STRATEGY_LABEL_KEYS` in `BoxScreenProctoringSettings.vue`).
