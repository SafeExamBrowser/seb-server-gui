import { computed, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import {
    ExamStatusEnum,
    ExamTypeEnum,
    toSelectableExamType,
} from "@/models/seb-server/examFiltersEnum.ts";
import { BasicSettings } from "@/models/seb-server/exam.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { useConsecutiveExamNames } from "./api/useConsecutiveExamNames.ts";

export const useBasicSettingsItems = (
    examId: number,
    basicSettings: Ref<BasicSettings>,
) => {
    const { t } = useI18n();

    const {
        data: consecutiveExamNames,
        loading: loadingConsecutiveExamNames,
        error: errorConsecutiveExamNames,
    } = useConsecutiveExamNames(String(examId));

    const loading = computed(() => loadingConsecutiveExamNames.value);

    const errors = computed(() =>
        [errorConsecutiveExamNames.value].filter(
            (error) => error !== undefined,
        ),
    );

    const getSelectedConsecutiveExamName = computed<string>(() => {
        if (!consecutiveExamNames.value) {
            return "";
        }
        if (!basicSettings.value.followupId) {
            return "";
        }

        return (
            consecutiveExamNames.value.find(
                (entity) =>
                    entity.modelId === String(basicSettings.value.followupId),
            )?.name ?? ""
        );
    });

    const items = computed<KeyValueItem[]>(() => {
        const result: KeyValueItem[] = [
            {
                key: "name",
                type: "basic",
                label: t("examDetail.info.name"),
                value: { type: "string", value: basicSettings.value.quizName },
            },
        ];

        if (
            basicSettings.value.quiz_description !== undefined &&
            basicSettings.value.quiz_description !== ""
        ) {
            result.push({
                key: "description",
                type: "basic",
                label: t("examDetail.info.description"),
                value: {
                    type: "string",
                    value: basicSettings.value.quiz_description,
                },
            });
        }

        const status = generalUtils.findEnumValue(
            ExamStatusEnum,
            basicSettings.value.status,
        );
        if (status !== null) {
            result.push({
                key: "status",
                type: "basic",
                label: t("examDetail.info.status"),
                value: {
                    type: "string",
                    value: t(status),
                },
            });
        }

        result.push({
            key: "startURL",
            type: "basic",
            label: t("examDetail.info.url"),
            value: {
                type: "string",
                value: basicSettings.value.quiz_start_url,
            },
        });

        result.push({
            key: "quizStartTime",
            type: "basic",
            label: t("examDetail.info.start"),
            value: {
                type: "string",
                value: timeUtils.formatIsoToReadableDateTime(
                    basicSettings.value.quizStartTime,
                ),
            },
        });

        result.push({
            key: "quizEndTime",
            type: "basic",
            label: t("examDetail.info.end"),
            value: {
                type: "string",
                value: timeUtils.formatIsoToReadableDateTime(
                    basicSettings.value.quizEndTime,
                ),
            },
        });

        result.push({
            key: "examType",
            type: "basic",
            label: t("examDetail.info.type"),
            value: {
                type: "string",
                value: t(
                    toSelectableExamType(basicSettings.value.type) ??
                        ExamTypeEnum.UNDEFINED,
                ),
            },
        });

        result.push({
            key: "consecutiveExam",
            type: "basic",
            label: t("examDetail.info.consecutiveExam"),
            value: {
                type: "string",
                value: getSelectedConsecutiveExamName.value,
            },
        });

        result.push({
            key: "quitPassword",
            type: "basic",
            label: t("examDetail.info.quitPassword"),
            value: {
                type: "password",
                value: basicSettings.value.quitPassword ?? "",
            },
        });

        result.push({
            key: "encryptPassword",
            type: "basic",
            label: t("examDetail.info.encryptPassword"),
            value: {
                type: "password",
                value: basicSettings.value.encryptPassword ?? "",
            },
        });

        return result;
    });

    return {
        items,
        consecutiveExamNames,
        loading,
        errors,
    };
};
