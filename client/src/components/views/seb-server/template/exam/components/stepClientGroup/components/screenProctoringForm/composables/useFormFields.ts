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
                    text: t(enumValue), // TODO @alain: i18n
                })),
                label: "screen proctoring collection strategy", // TODO @alain: i18n
                placeholder: "select the screen proctoring collection strategy", // TODO @alain: i18n
                required: true,
            },
        ];
    });

    return {
        formFields,
    };
};
