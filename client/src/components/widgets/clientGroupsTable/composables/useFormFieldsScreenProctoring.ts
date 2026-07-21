import { computed, Ref } from "vue";

import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";

export const useFormFieldsScreenProctoring = (
    clientGroup: Ref<ClientGroupTransient>,
    screenProctoringAllowedForGroups: Ref<boolean>,
): FormField[] => {
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
                "clientGroups.fields.screenProctoringEnabled.label",
            ),
        },
    ];
};
