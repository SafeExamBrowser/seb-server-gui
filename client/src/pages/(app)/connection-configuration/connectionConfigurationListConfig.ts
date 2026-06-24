export const CONNECTION_CONFIGURATION_COLUMN = {
    institutionId: "institutionId",
    name: "name",
    date: "date",
    active: "active",
} as const;

export const connectionConfigurationListConfig = {
    testIdBase: "connectionConfigurations",
    route: "/connection-configuration",
    itemKey: "id",
} as const;
