type ConnectionConfiguration = {
    id: number;
    institutionId: number;
    name: string;
    sebConfigPurpose: string;
    sebServerPingTime: number;
    vdiSetup: string;
    vdiExecutable: string;
    vdiPath: string;
    vdiArguments: string;
    sebServerFallback: boolean;
    startURL: string;
    sebServerFallbackTimeout: number;
    sebServerFallbackAttempts: number;
    sebServerFallbackAttemptInterval: number;
    sebServerFallbackPasswordHash: string;
    sebServerFallbackPasswordHashConfirm: string;
    hashedQuitPassword: string;
    hashedQuitPasswordConfirm: string;
    date: string;
    encryptSecret: string;
    confirm_encrypt_secret: string;
    cert_alias: string;
    cert_encryption_asym: boolean;
    active: boolean;
    lastUpdateTime: Date;
    lastUpdateUser: string;
    exam_selection: Set<number>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ConnectionConfigurations = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ConnectionConfiguration[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ConnectionConfigurationName = {
    modelId: string;
    name: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type OptionalParGetConnectionConfiguration = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    name?: string;

    active?: string | null;
    institutionId?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateConnectionConfigurationPar = {
    name: string;
    sebConfigPurpose: string;
    sebServerPingTime: number;
    exam_selection?: number[];

    cert_alias?: string;
    encryptSecret?: string;
    confirm_encrypt_secret?: string;
    cert_encryption_asym?: boolean;

    configurationPassword?: string;
    confirmConfigurationPassword?: string;

    sebServerFallback: boolean;
    startURL?: string;
    sebServerFallbackTimeout?: number;
    sebServerFallbackAttempts?: number;
    sebServerFallbackAttemptInterval?: number;

    sebServerFallbackPasswordHash?: string;
    sebServerFallbackPasswordHashConfirm?: string;

    hashedQuitPassword?: string;
    hashedQuitPasswordConfirm?: string;

    vdiSetup: "NO";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UpdateConnectionConfigurationPar = {
    id: string;
    institutionId: string;
    name: string;
    sebConfigPurpose: string;
    sebServerPingTime: number;
    exam_selection?: number[];

    encryptSecret?: string;
    confirm_encrypt_secret?: string;
    cert_encryption_asym?: boolean;
    cert_alias?: string;

    configurationPassword?: string;
    confirmConfigurationPassword?: string;

    sebServerFallback: boolean;
    startURL?: string;
    sebServerFallbackTimeout?: number;
    sebServerFallbackAttempts?: number;
    sebServerFallbackAttemptInterval?: number;

    sebServerFallbackPasswordHash?: string;
    sebServerFallbackPasswordHashConfirm?: string;

    hashedQuitPassword?: string;
    hashedQuitPasswordConfirm?: string;

    vdiSetup: "NO";
};
