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

export const useBasicSettingsItems = (basicSettings: Ref<BasicSettings>) => {
    const { t } = useI18n();

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
            basicSettings.value.description !== undefined &&
            basicSettings.value.description !== ""
        ) {
            result.push({
                key: "description",
                type: "basic",
                label: t("examDetail.info.description"),
                value: {
                    type: "string",
                    value: basicSettings.value.description,
                },
            });
        }

        result.push({
            key: "startURL",
            type: "basic",
            label: t("examDetail.info.url"),
            value: {
                type: "string",
                value: basicSettings.value.startURL,
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

        const status = generalUtils.findEnumValue(
            ExamStatusEnum,
            basicSettings.value.status,
        );
        if (status !== null) {
            result.push({
                key: "clientConfiguration",
                type: "basic",
                label: t("examDetail.info.status"),
                value: {
                    type: "string",
                    value: t(status),
                },
            });
        }

        return result;
    });

    return { items };
};
