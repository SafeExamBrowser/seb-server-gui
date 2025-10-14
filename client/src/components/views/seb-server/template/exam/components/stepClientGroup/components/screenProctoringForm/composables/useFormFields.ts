import { FormField } from "@/components/widgets/form/types";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { SCREEN_PROCTORING_COLLECTION_STRATEGY } from "@/components/views/seb-server/template/exam/types";
import { useI18n } from "vue-i18n";

export const useFormFields = () => {
    const { t } = useI18n();

    const {
        screenProctoringCollectionStrategy:
            modelScreenProctoringCollectionStrategy,
    } = storeToRefs(useCreateExamTemplateStore());

    const formFields = computed<FormField[]>(() => {
        return [
            {
                type: "select" as const,
                name: "screenProctoringCollectionStrategy",
                model: modelScreenProctoringCollectionStrategy,
                options: Object.values(
                    SCREEN_PROCTORING_COLLECTION_STRATEGY,
                ).map((enumValue) => ({
                    value: enumValue,
                    text: t(
                        `createTemplateExam.general.fields.screenProctoringCollectionStrategy.strategies.${enumValue}`,
                    ),
                })),
                label: t(
                    "createTemplateExam.general.fields.screenProctoringCollectionStrategy.label",
                ),
                placeholder: t(
                    "createTemplateExam.general.fields.screenProctoringCollectionStrategy.placeholder",
                ),
                required: true,
            },
        ];
    });

    return {
        formFields,
    };
};
