export enum LMSFeatureEnum {
    COURSE_API,
    SEB_RESTRICTION,
    COURSE_RECOVERY,
    LMS_FULL_INTEGRATION
}

export enum LMSTypeEnum {
    MOCKUP = "MOCKUP",
    OPEN_EDX = "OPEN_EDX",
    MOODLE= "MOODLE",
    MOODLE_PLUGIN = "MOODLE_PLUGIN",
    ANS_DELFT = "ANS_DELFT",
    OPEN_OLAT = "OPEN_OLAT"
}

export const LMSTypeFeatureMappig = new Map<LMSTypeEnum, LMSFeatureEnum[]>([
    [LMSTypeEnum.MOCKUP, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.SEB_RESTRICTION, LMSFeatureEnum.LMS_FULL_INTEGRATION]],
    [LMSTypeEnum.OPEN_EDX, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.SEB_RESTRICTION]],
    [LMSTypeEnum.MOODLE, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.COURSE_RECOVERY]],
    [LMSTypeEnum.MOODLE_PLUGIN, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.COURSE_RECOVERY, LMSFeatureEnum.SEB_RESTRICTION, LMSFeatureEnum.LMS_FULL_INTEGRATION]],
    [LMSTypeEnum.ANS_DELFT, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.SEB_RESTRICTION]],
    [LMSTypeEnum.OPEN_OLAT, [LMSFeatureEnum.COURSE_API, LMSFeatureEnum.SEB_RESTRICTION]]
]);
