export enum ExamStatusEnum {
    UP_COMING = "UP_COMING",
    TEST_RUN = "TEST_RUN",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    ARCHIVED = "ARCHIVED",
}

export const examStatusColor: Record<ExamStatusEnum, string> = {
    [ExamStatusEnum.RUNNING]: "green",
    [ExamStatusEnum.FINISHED]: "red",
    [ExamStatusEnum.UP_COMING]: "orange",
    [ExamStatusEnum.TEST_RUN]: "blue",
    [ExamStatusEnum.ARCHIVED]: "grey-darken-2",
};

export enum ExamTypeEnum {
    UNDEFINED = "UNDEFINED",
    MANAGED = "MANAGED",
    BYOD = "BYOD",
    VDI = "VDI",
}

export const SELECTABLE_EXAM_TYPES = [
    ExamTypeEnum.MANAGED,
    ExamTypeEnum.BYOD,
    ExamTypeEnum.VDI,
] as const;

// TODO @alain: once ExamTemplate has a zod schema, this can be done with a zod codec
export const toSelectableExamType = (
    value?: string,
): ExamTypeEnum | undefined =>
    SELECTABLE_EXAM_TYPES.find((examType) => examType === value);

// TODO @alain: once ExamTemplate has a zod schema, this can be done with a zod codec
export const toApiExamType = (value?: ExamTypeEnum): ExamTypeEnum =>
    value ?? ExamTypeEnum.UNDEFINED;
