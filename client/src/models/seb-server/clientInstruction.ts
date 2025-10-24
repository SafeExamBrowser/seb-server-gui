export type ClientInstruction = {
    id?: number;
    examId: number;
    type: string;
    connectionToken: string;
    attributes?: Record<string, unknown>;
};
