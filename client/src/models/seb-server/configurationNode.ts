export type ConfigurationTemplateName = {
    modelId: string;
    name: string;
};

export type ConfigurationTemplateKey = {
    id: string;
    name: string;
};

export type SEBSettingsImport = {
    file: Blob;
    fileName: string;
    configurationTemplateId: string;
    password?: string;
    quitPassword?: string;
};

export type ConfigurationKey = {
    id: string;
    configurationNodeId: string;
};
