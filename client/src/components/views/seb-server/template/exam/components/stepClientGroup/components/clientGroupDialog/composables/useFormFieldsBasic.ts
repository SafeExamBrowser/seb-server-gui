import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import i18n from "@/i18n";

export const useFormFieldsBasic = (
    clientGroup: Ref<ClientGroupTransient>,
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
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.placeholder",
            ),
            required: true,
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
