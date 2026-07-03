// Shared key vocabulary for the connection-configuration create/edit form, referenced by
// BOTH the form-fields composable's `name:` and the e2e form page model, so the test locators
// and the app's rendered per-field test-ids (`<formBase>-field-<name>`) cannot drift.
export const CONNECTION_CONFIG_FIELD = {
    name: "name",
    configurationPurpose: "configurationPurpose",
    configurationPassword: "configurationPassword",
    confirmConfigurationPassword: "confirmConfigurationPassword",
    pingInterval: "pingInterval",
    asymmetricOnlyEncryption: "asymmetricOnlyEncryption",
    fallbackStartUrl: "fallbackStartUrl",
    connectionAttempts: "connectionAttempts",
    interval: "interval",
    connectionTimeout: "connectionTimeout",
    fallbackPassword: "fallbackPassword",
    confirmFallbackPassword: "confirmFallbackPassword",
    quitPassword: "quitPassword",
    confirmQuitPassword: "confirmQuitPassword",
} as const;

export const connectionConfigurationFormConfig = {
    createRoute: "/connection-configuration/create",
    createTestPrefix: "createConnectionConfiguration",
    editRoute: (id: string | number) => `/connection-configuration/${id}`,
    editTestPrefix: "editConnectionConfiguration",
    // The form is split across two FormBuilders; fields namespace under each base
    // (`<prefix>-<suffix>-field-<name>`).
    mainFormSuffix: "main-form",
    fallbackFormSuffix: "fallback-form",
} as const;
