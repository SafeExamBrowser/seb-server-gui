import { certificateListConfig } from "@/pages/(app)/certificate/certificateListConfig.ts";

// Shared key vocabulary for the certificate upload dialog, referenced by BOTH the
// create-form composable's `name:` and the e2e dialog model, so the test locators and the
// rendered per-field test-ids (`<dialogForm>-field-<name>`) cannot drift.
export const CERTIFICATE_FIELD = {
    file: "file",
    password: "password",
} as const;

export const certificateFormConfig = {
    uploadDialogTestId: `${certificateListConfig.testIdBase}-create-dialog`,
    uploadFormTestId: `${certificateListConfig.testIdBase}-create-dialog-form`,
    uploadSubmitTestId: `${certificateListConfig.testIdBase}-create-dialog-submit-button`,
    uploadCancelTestId: `${certificateListConfig.testIdBase}-create-dialog-cancel-button`,
} as const;
