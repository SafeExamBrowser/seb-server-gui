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
