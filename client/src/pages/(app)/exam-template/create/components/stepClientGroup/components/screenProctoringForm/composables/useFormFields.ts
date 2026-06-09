import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { SCREEN_PROCTORING_COLLECTION_STRATEGY } from "@/models/seb-server/screenProctoring.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";
import i18n from "@/i18n";

export const useFormFields = () => {
    const { collectionStrategy: modelScreenProctoringCollectionStrategy } =
        storeToRefs(useScreenProctoringStore());

    const info = computed<string | undefined>(() => {
        if (modelScreenProctoringCollectionStrategy.value === undefined) {
            return undefined;
        }

        return i18n.global.t(
            `createTemplateExam.general.fields.screenProctoringCollectionStrategy.info.${modelScreenProctoringCollectionStrategy.value}`,
        );
    });

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
                    text: i18n.global.t(
                        `createTemplateExam.general.fields.screenProctoringCollectionStrategy.strategies.${enumValue}`,
                    ),
                })),
                label: i18n.global.t(
                    "createTemplateExam.general.fields.screenProctoringCollectionStrategy.label",
                ),
                placeholder: i18n.global.t(
                    "createTemplateExam.general.fields.screenProctoringCollectionStrategy.placeholder",
                ),
                required: true,
                info: info.value,
            },
        ];
    });

    return {
        formFields,
    };
};
