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
    creation_date: Date;
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