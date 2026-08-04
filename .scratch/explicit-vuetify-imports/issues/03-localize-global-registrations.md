# 03 — Localize the globally registered Vuetify components

**What to build:** The Vuetify plugin setup no longer registers any components app-wide: the `components` option of `createVuetify` is removed entirely. The components it registered (the vertical stepper family, color input, file upload) resolve purely through the local imports that tickets 01/02 added to their using files. In the running app, the views using these components (exam template wizard stepper, color input, file upload dialogs) work exactly as before.

**Blocked by:** 01, 02 — the local imports must already exist everywhere these components are used.

**Status:** ready-for-agent

- [ ] `createVuetify` has no `components` option
- [ ] Full lint run green; `vue-tsc --noEmit` green
- [ ] Browser check on the running dev server: views using the formerly global components render without "Failed to resolve component" console warnings
