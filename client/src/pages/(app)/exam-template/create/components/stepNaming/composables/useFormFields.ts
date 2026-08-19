import { storeToRefs } from "pinia";

import { useExamTemplateBasicSettingsFields } from "@/pages/(app)/exam-template/composables/useExamTemplateBasicSettingsFields.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";

import { useStepNamingStore } from "./store/useStepNamingStore.ts";

export const useFormFields = () => {
    const {
        name,
        description,
        examType,
        clientConfiguration,
        lmsIntegration,
        institutionalDefault,
    } = storeToRefs(useStepNamingStore());

    const { enabled: screenProctoringEnabled } = storeToRefs(
        useScreenProctoringStore(),
    );

    return useExamTemplateBasicSettingsFields(
        {
            name,
            description,
            examType,
            clientConfiguration,
            lmsIntegration,
            institutionalDefault,
        },
        { screenProctoringEnabled },
    );
};
