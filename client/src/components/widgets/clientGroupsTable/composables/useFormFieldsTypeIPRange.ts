import { computed, Ref } from "vue";
import { RuleAliases } from "vuetify/labs/rules";

import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";

export const useFormFieldsTypeIPRange = (
    clientGroup: Ref<ClientGroupTransient>,
    rules: RuleAliases,
): FormField[] => {
    const ipRangeStart = computed<string>({
        get: (): string => clientGroup.value.ipRangeStart || "",
        set: (value: string) => {
            clientGroup.value = { ...clientGroup.value, ipRangeStart: value };
        },
    });

    const ipRangeEnd = computed<string>({
        get: (): string => clientGroup.value.ipRangeEnd || "",
        set: (value: string) => {
            clientGroup.value = { ...clientGroup.value, ipRangeEnd: value };
        },
    });

    return [
        {
            type: "text" as const,
            name: "ip4RangeStart",
            model: ipRangeStart,
            label: i18n.global.t("clientGroups.fields.ipRangeStart.label"),
            placeholder: i18n.global.t(
                "clientGroups.fields.ipRangeStart.placeholder",
            ),
            required: true,
            rules: [rules.ipAddress(undefined)],
        },
        {
            type: "text" as const,
            name: "ip4RangeEnd",
            model: ipRangeEnd,
            label: i18n.global.t("clientGroups.fields.ipRangeEnd.label"),
            placeholder: i18n.global.t(
                "clientGroups.fields.ipRangeEnd.placeholder",
            ),
            required: true,
            rules: [rules.ipAddress(undefined)],
        },
    ];
};
