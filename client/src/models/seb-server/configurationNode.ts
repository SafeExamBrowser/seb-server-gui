export type ConfigurationTemplateKey = {
    id: string;
    name: string;
    lastUpdateTime: string;
    lastUpdateUserName: string;
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

export type ConfigurationExamMapping = {
    id: number;
    examId: number;
    configurationNodeId: number;
    encryptSecret?: string;
    confirm_encrypt_secret?: string;
};
