import { computed, ref, Ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import {
    FormField,
    TimeRange,
} from "@/components/widgets/formBuilder/types.ts";
import {
    ExamTypeEnum,
    SELECTABLE_EXAM_TYPES,
} from "@/models/seb-server/examFiltersEnum.ts";
import i18n from "@/i18n";
import { AppError } from "@/services/errors/types";
import { isURL } from "@/utils/generalUtils";

export const useExamBasicSettingsFields = (
    models: {
        quizName: Ref<string | undefined>;
        description: Ref<string | undefined>;
        startURL: Ref<string | undefined>;
        quizTimeRange: Ref<TimeRange | undefined>;
        type: Ref<ExamTypeEnum | undefined>;
    },
    options?: {
        examWithURL?: Ref<boolean>;
    },
) => {
    const loading = ref<boolean>(false);
    const errors = ref<AppError[]>([]);

    const formFields = computed<FormField[]>(() => {
        if (loading.value) {
            return [];
        }

        const fields: FormField[] = [];
        if (options?.examWithURL?.value) {
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
        } else {
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
        }

        loading.value = false;

        return fields;
    });

    return {
        formFields,
        loading,
        errors,
    };
};
