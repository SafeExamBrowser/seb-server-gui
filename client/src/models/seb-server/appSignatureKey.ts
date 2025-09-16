// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AppSignatureKey = {
    institutionId: number;
    examId: number;
    keyValue: string;
    connectionIds: Record<string, string>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GrantedAppSignatureKey = {
    id: number;
    institutionId: number;
    keyType: string;
    keyValue: string;
    tag: string;
    examId: number;
};
