import { computed, Ref } from "vue";
import { useRules } from "vuetify/labs/rules";

import { EntityName } from "@/api/seb-server/generated/hey-api";
import {
    FormField,
    TimeRange,
} from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import {
    ExamTypeEnum,
    SELECTABLE_EXAM_TYPES,
} from "@/models/seb-server/examFiltersEnum.ts";
import { isURL } from "@/utils/generalUtils";

export const useExamBasicSettingsFields = (
    examWithURL: boolean,
    consecutiveExamNames: Ref<EntityName[] | undefined>,
    models: {
        quizName: Ref<string | undefined>;
        description: Ref<string | undefined>;
        startURL: Ref<string | undefined>;
        quizTimeRange: Ref<TimeRange | undefined>;
        type: Ref<ExamTypeEnum | undefined>;
        consecutiveExam: Ref<string | undefined>;
        quitPassword: Ref<string | undefined>;
        encryptPassword: Ref<string | undefined>;
    },
) => {
    const formFields = computed<FormField[]>(() => {
        const fields: FormField[] = [];
        if (!consecutiveExamNames.value) {
            return fields;
        }

        if (examWithURL) {
            fields.push({
                type: "text" as const,
                name: "quizName",
                model: models.quizName,
                label: i18n.global.t("examDetail.info.name"),
                required: true,
                rules: [useRules().minLength(3), useRules().maxLength(255)],
            });
            fields.push({
                type: "textarea" as const,
                name: "description",
                model: models.description,
                label: i18n.global.t("examDetail.info.description"),
                required: false,
                rules: [useRules().maxLength(4000)],
            });
            fields.push({
                type: "time-range" as const,
                name: "quizTimeRange",
                model: models.quizTimeRange,
                label: i18n.global.t(
                    "createExam.steps.withURL.fields.timeRange",
                ),
                required: true,
            });
            fields.push({
                type: "text" as const,
                name: "startURL",
                model: models.startURL,
                label: i18n.global.t("examDetail.info.url"),
                required: true,
                rules: [
                    (val: string) => {
                        return (
                            isURL(val) ||
                            i18n.global.t(
                                "createExam.steps.withURL.fields.examURL.invalid",
                            )
                        );
                    },
                ],
            });
        }

        fields.push({
            type: "select" as const,
            name: "type",
            model: models.type,
            options: SELECTABLE_EXAM_TYPES.map((enumValue) => ({
                value: enumValue,
                text: i18n.global.t(enumValue),
            })),
            label: i18n.global.t("examDetail.info.type"),
        });

        fields.push({
            type: "select" as const,
            name: "consecutiveExam",
            model: models.consecutiveExam,
            options:
                consecutiveExamNames.value.map((entity) => ({
                    value: entity.modelId,
                    text: entity.name,
                })) ?? [],
            label: i18n.global.t("examDetail.info.consecutiveExam"),
            required: false,
        });

        fields.push({
            type: "password" as const,
            name: "type",
            model: models.quitPassword,
            label: i18n.global.t("examDetail.info.quitPassword"),
            required: false,
        });

        fields.push({
            type: "password" as const,
            name: "type",
            model: models.encryptPassword,
            label: i18n.global.t("examDetail.info.encryptPassword"),
            required: false,
        });

        return fields;
    });

    return {
        formFields,
    };
};
