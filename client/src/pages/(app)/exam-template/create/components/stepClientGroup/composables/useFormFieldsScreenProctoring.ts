import { ClientGroupTransient } from "@/pages/(app)/exam-template/create/components/stepClientGroup/types.ts";
import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";
import { storeToRefs } from "pinia";
export const useFormFieldsScreenProctoring = (
    clientGroup: Ref<ClientGroupTransient>,
): FormField[] => {
    const { screenProctoringAllowedForGroups } = storeToRefs(
        useScreenProctoringStore(),
    );

    const screenProctoringEnabled = computed<
        ClientGroupTransient["screenProctoringEnabled"]
    >({
        get: (): ClientGroupTransient["screenProctoringEnabled"] =>
            clientGroup.value.screenProctoringEnabled,
        set: (value: ClientGroupTransient["screenProctoringEnabled"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                screenProctoringEnabled: value,
            };
        },
    });

    if (!screenProctoringAllowedForGroups.value) {
        return [];
    }

    return [
        {
            type: "switch" as const,
            name: "screenProctoringEnabled",
            model: screenProctoringEnabled,
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
            ),
        },
    ];
};
