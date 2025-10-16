export type AppSignatureKey = {
    institutionId: number;
    examId: number;
    keyValue: string;
    connectionIds: Record<string, string>;
};

export type GrantedAppSignatureKey = {
    id: number;
    institutionId: number;
    keyType: string;
    keyValue: string;
    tag: string;
    examId: number;
};

export type AppSignatureKeysWithGrantValues = {
    id?: number;
    institutionId: number;
    examId: number;
    keyValue: string;
    connectionIds: Record<string, string>;
    keyType?: string;
    tag?: string;
};
