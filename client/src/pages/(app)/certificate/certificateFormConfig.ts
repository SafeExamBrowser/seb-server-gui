// Shared key vocabulary for the certificate upload form fields, referenced by the
// create-form composable's `name:` (the dialog is embedded by the exam-template and
// connection-configuration pages), so rendered per-field test-ids
// (`<dialogForm>-field-<name>`) cannot drift.
export const CERTIFICATE_FIELD = {
    file: "file",
    password: "password",
} as const;
