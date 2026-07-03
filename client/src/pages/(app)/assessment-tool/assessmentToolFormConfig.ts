// Shared key vocabulary for the assessment-tool create/edit form, referenced by BOTH the
// form-fields composable's `name:` and the e2e form page model, so the test locators and the
// app's rendered per-field test-ids (`<formBase>-field-<name>`) cannot drift.
export const ASSESSMENT_TOOL_FIELD = {
    institutionId: "institutionId",
    name: "name",
    lmsType: "lmsType",
    lmsUrl: "lmsUrl",
    lmsClientname: "lmsClientname",
    lmsClientsecret: "lmsClientsecret",
    accessToken: "accessToken",
    proxyHost: "proxyHost",
    proxyPort: "proxyPort",
    proxyUsername: "proxyUsername",
    proxyPassword: "proxyPassword",
} as const;

export const assessmentToolFormConfig = {
    createRoute: "/assessment-tool/create",
    createTestPrefix: "createAssessmentTool",
    editRoute: (id: string | number) => `/assessment-tool/${id}`,
    editTestPrefix: "editAssessmentTool",
    // The form is split across three FormBuilders; fields namespace under each base
    // (`<prefix>-<suffix>-field-<name>`).
    mainFormSuffix: "main-form",
    authFormSuffix: "auth-form",
    proxyFormSuffix: "proxy-form",
} as const;
