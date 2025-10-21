import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, ModelRef } from "vue";
import { useI18n } from "vue-i18n";
import { FormField } from "@/components/widgets/formBuilder/types";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { storeToRefs } from "pinia";
export const useFormFieldsScreenProctoring = (
    clientGroup: ModelRef<ClientGroupTransient>,
): FormField[] => {
    const { t } = useI18n();

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
            label: t(
                "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
            ),
        },
    ];
};
