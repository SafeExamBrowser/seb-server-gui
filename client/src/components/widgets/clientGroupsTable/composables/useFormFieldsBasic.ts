import { computed, Ref } from "vue";
import { RuleAliases } from "vuetify/labs/rules";

import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";

export const useFormFieldsBasic = (
    clientGroup: Ref<ClientGroupTransient>,
    rules: RuleAliases,
    groups: Ref<ClientGroupExisting[]>,
): FormField[] => {
    const name = computed<ClientGroupTransient["name"]>({
        get: (): ClientGroupTransient["name"] => clientGroup.value.name,
        set: (value: ClientGroupTransient["name"]) => {
            clientGroup.value = { ...clientGroup.value, name: value };
        },
    });

    const type = computed<ClientGroupTransient["type"]>({
        get: (): ClientGroupTransient["type"] => clientGroup.value.type,
        set: (value: ClientGroupTransient["type"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                type: value,
            };
        },
    });

    return [
        {
            type: "text" as const,
            name: "name",
            model: name,
            label: i18n.global.t("clientGroups.fields.name.label"),
            placeholder: i18n.global.t("clientGroups.fields.name.placeholder"),
            required: true,
            rules: [
                rules.minLength(3),
                rules.maxLength(255),
                rules.blacklisted(
                    new Set(
                        groups.value
                            // Blacklist names of all other groups.
                            // Exclude current clientGroup, as it can already be in the list in case of editing.
                            .filter(
                                (group) => group.id !== clientGroup.value.id,
                            )
                            .map((group: ClientGroupExisting) => group.name),
                    ),
                    i18n.global.t(
                        "clientGroups.fields.name.validationErrorUniqueName",
                    ),
                ),
            ],
        },
        {
            type: "select" as const,
            name: "type",
            model: type,
            options: [
                ClientGroupEnum.IP_V4_RANGE,
                ClientGroupEnum.CLIENT_OS,
                ClientGroupEnum.NAME_ALPHABETICAL_RANGE,
            ].map((value) => ({
                value,
                text: i18n.global.t(`clientGroups.fields.type.types.${value}`),
            })),
            label: i18n.global.t("clientGroups.fields.type.label"),
            placeholder: i18n.global.t("clientGroups.fields.type.placeholder"),
            required: true,
        },
    ];
};
