import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, ModelRef } from "vue";
import { useI18n } from "vue-i18n";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

export const useFormFieldsBasic = (
    clientGroup: ModelRef<ClientGroupTransient>,
): FormField[] => {
    const { t } = useI18n();

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
            label: t("createTemplateExam.steps.clientGroup.fields.name.label"),
            placeholder: t(
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
                text: t(
                    `createTemplateExam.steps.clientGroup.fields.type.types.${value}`,
                ),
            })),
            label: t("createTemplateExam.steps.clientGroup.fields.type.label"),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.type.placeholder",
            ),
            required: true,
        },
    ];
};
