// Shared key vocabulary for the certificate upload dialog, referenced by BOTH the
// create-form composable's `name:` and the e2e dialog model, so the test locators and the
// rendered per-field test-ids (`<dialogForm>-field-<name>`) cannot drift.
export const CERTIFICATE_FIELD = {
    file: "file",
    password: "password",
} as const;
