import {
    ClientGroup,
    ClientGroupTransient,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import i18n from "@/i18n";
import { RuleAliases } from "vuetify/labs/rules";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

export const useFormFieldsBasic = (
    clientGroup: Ref<ClientGroupTransient>,
    rules: RuleAliases,
): FormField[] => {
    const stepClientGroupStore = useStepClientGroupStore();

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
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.placeholder",
            ),
            required: true,
            rules: [
                rules.minLength(3),
                rules.maxLength(255),
                rules.blacklisted(
                    new Set(
                        stepClientGroupStore.groups
                            // Blacklist names of all other groups in the store.
                            // Exclude current clientGroup, as it can already be in the store in case of editing.
                            .filter(
                                (group) => group.id !== clientGroup.value.id,
                            )
                            .map((group: ClientGroup) => group.name),
                    ),
                    i18n.global.t(
                        "createTemplateExam.steps.clientGroup.fields.name.validationErrorUniqueName",
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
                text: i18n.global.t(
                    `createTemplateExam.steps.clientGroup.fields.type.types.${value}`,
                ),
            })),
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.type.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.type.placeholder",
            ),
            required: true,
        },
    ];
};
