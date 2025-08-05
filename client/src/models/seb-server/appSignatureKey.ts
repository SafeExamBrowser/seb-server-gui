 type AppSignatureKey = {
    institutionId: number;
    examId: number;
    keyValue: string;
    connectionIds: Record<string, string>; // key: connection ID as string, value: participant name
};

