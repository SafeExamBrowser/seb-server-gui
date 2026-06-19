import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { clientOSLimitedValues } from "@/models/seb-server/clientGroupEnum.ts";
import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

export const useFormFieldsTypeClientOS = (
    clientGroup: Ref<ClientGroupTransient>,
): FormField[] => {
    const clientOS = computed<ClientGroupTransient["clientOS"]>({
        get: (): ClientGroupTransient["clientOS"] => clientGroup.value.clientOS,
        set: (value: ClientGroupTransient["clientOS"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                clientOS: value,
            };
        },
    });

    return [
        {
            type: "select" as const,
            name: "clientOS",
            model: clientOS,
            options: clientOSLimitedValues.map((value) => ({
                value,
                text: i18n.global.t(
                    `clientGroups.fields.clientOS.types.${value}`,
                ),
            })),
            label: i18n.global.t("clientGroups.fields.clientOS.label"),
            placeholder: i18n.global.t(
                "clientGroups.fields.clientOS.placeholder",
            ),
            required: true,
        },
    ];
};
