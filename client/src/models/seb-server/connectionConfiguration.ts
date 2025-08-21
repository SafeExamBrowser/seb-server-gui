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
    sebConfigPurpose : string; //Config Purpose
    sebServerPingTime: number;  //Interval
    exam_selection? : Number[]; //Exam Selection

    encryptSecret? : string; //encrypt with certificate
    confirm_encrypt_secret? : string;
    cert_encryption_asym? : boolean; // use asymmetric only encryption

    configurationPassword? : string;
    confirmConfigurationPassword? : string;

    sebServerFallback : boolean; //with Fallback value
    startURL? : string; //Fallback Start URL
    sebServerFallbackTimeout? : number;  //Connection Timeout
    sebServerFallbackAttempts? : number;  //Connection Attempts
    sebServerFallbackAttemptInterval? : number; //Fallback Interval

    sebServerFallbackPasswordHash?: string;
    sebServerFallbackPasswordHashConfirm? : string;

    hashedQuitPassword? : string;
    hashedQuitPasswordConfirm? : string;

    "vdiSetup": "NO"
}



type UpdateConnectionConfigurationPar = {
    id: string;
    name: string;
    configurationPassword? : string;
    confirmConfigurationPassword? : string;
    encryptWithCertificate? : string;
    pingInterval: number;
    exams? : Number[]
    fallbackStartUrl? : string;
    interval? : number;
    connectionAttempts? : number;
    connectionTimeout? : number;
    fallbackPassword?: string;
    confirmFallbackPassword? : string;
    quitPassword? : string;
    confirmQuitPassword? : string;
}
