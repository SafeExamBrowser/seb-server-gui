export type ConnectionConfiguration = {
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

export type ConnectionConfigurations = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: ConnectionConfiguration[];
};

export type ConnectionConfigurationName = {
    modelId: string;
    name: string;
};

// TODO @alain: once ExamTemplate has a zod schema, this can be done with a zod codec
// 0 is the API's "no connection configuration" sentinel; sending undefined omits the
// field from the PUT and leaves the stored value unchanged, so clearing must send 0.
export const toApiClientConfigurationId = (value?: string): number =>
    value ? Number(value) : 0;

// TODO @alain: once ExamTemplate has a zod schema, this can be done with a zod codec
export const toSelectableClientConfigurationId = (
    value?: number,
): string | undefined =>
    value === undefined || value === 0 ? undefined : String(value);

export type OptionalParGetConnectionConfiguration = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    name?: string;

    active?: string | null;
    institutionId?: string | null;
};

export type CreateConnectionConfigurationPar = {
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

export type UpdateConnectionConfigurationPar = {
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
