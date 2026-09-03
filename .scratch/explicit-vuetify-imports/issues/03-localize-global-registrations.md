# 03 — Localize the globally registered Vuetify components

**What to build:** The Vuetify plugin setup no longer registers any components app-wide: the `components` option of `createVuetify` is removed entirely. The components it registered (the vertical stepper family, color input, file upload) resolve purely through the local imports that tickets 01/02 added to their using files. In the running app, the views using these components (exam template wizard stepper, color input, file upload dialogs) work exactly as before.

**Blocked by:** 01, 02 — the local imports must already exist everywhere these components are used.

**Status:** done

- [x] `createVuetify` has no `components` option
- [x] Full lint run green; `vue-tsc --noEmit` green
- [x] Browser check on the running dev server: views using the formerly global components render without "Failed to resolve component" console warnings

---

**Implemented** (2026-08-04)

- Removed the `components` option and the `vuetify/components` import block from `src/plugins/vuetify.ts`; nothing else in the file changed.
- Pre-check confirmed all users carry local imports from tickets 01/02: `StepperVertical.vue` (VStepperVertical, VStepperVerticalItem), `ColorSetting.vue`/`FormFieldColor.vue` (VColorInput), `FormFieldImage.vue` (VFileUpload). `VStepperVerticalActions` was registered but used nowhere — dropped without replacement.
- Verification: `lint:check:all` exit 0, `vue-tsc --noEmit` exit 0. Browser (dev server, logged in as super-admin): exam-template create wizard renders the vertical stepper (6 steps), `/institution/create` renders the file-upload drop zone, edit-indicator dialog on exam template 14 renders the color inputs. No "Failed to resolve component" console warnings (only sandbox HMR-websocket noise and pre-login oauth 400s).
- Note: auto-import is still on, so this check can't fully prove local resolution — ticket 04's smoke test after the `autoImport: false` flip is the binding proof.
