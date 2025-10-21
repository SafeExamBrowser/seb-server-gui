import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, ModelRef } from "vue";
import { useI18n } from "vue-i18n";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientOSEnum } from "@/models/seb-server/clientGroupEnum";

export const useFormFieldsTypeClientOS = (
    clientGroup: ModelRef<ClientGroupTransient>,
): FormField[] => {
    const { t } = useI18n();

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
            options: [
                ClientOSEnum.WINDOWS,
                ClientOSEnum.MAC_OS,
                ClientOSEnum.I_OS,
                ClientOSEnum.IPAD_OS,
                ClientOSEnum.I_OS_OR_IPAD_OS,
            ].map((value) => ({
                value,
                text: t(
                    `createTemplateExam.steps.clientGroup.fields.clientOS.types.${value}`,
                ),
            })),
            label: t(
                "createTemplateExam.steps.clientGroup.fields.clientOS.label",
            ),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.clientOS.placeholder",
            ),
            required: true,
        },
    ];
};
