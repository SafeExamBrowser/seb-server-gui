import {
    ClientGroupTransient,
    clientOSLimitedValues,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types";

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
                    `createTemplateExam.steps.clientGroup.fields.clientOS.types.${value}`,
                ),
            })),
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.clientOS.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.clientOS.placeholder",
            ),
            required: true,
        },
    ];
};
