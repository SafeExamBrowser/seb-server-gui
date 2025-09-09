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

type ConnectionConfigurations = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ConnectionConfiguration[];
};

type OptionalParGetConnectionConfiguration = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    name?: string;

    active?: string | null;
    institutionId?: string | null;
};

type CreateConnectionConfigurationPar = {
    name: string;
    sebConfigPurpose: string;
    sebServerPingTime: number;
    exam_selection?: Number[];

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

type UpdateConnectionConfigurationPar = {
    id: string;
    institutionId: string;
    name: string;
    sebConfigPurpose: string;
    sebServerPingTime: number;
    exam_selection?: Number[];

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
