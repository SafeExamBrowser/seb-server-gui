import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, ModelRef } from "vue";
import { useI18n } from "vue-i18n";
import { FormField } from "@/components/widgets/formBuilder/types";

export const useFormFieldsTypeIpRange = (
    clientGroup: ModelRef<ClientGroupTransient>,
): FormField[] => {
    const { t } = useI18n();

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
            label: t(
                "createTemplateExam.steps.clientGroup.fields.ipRangeStart.label",
            ),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.ipRangeStart.placeholder",
            ),
            required: true,
        },
        {
            type: "text" as const,
            name: "ip4RangeEnd",
            model: ipRangeEnd,
            label: t(
                "createTemplateExam.steps.clientGroup.fields.ipRangeEnd.label",
            ),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.ipRangeEnd.placeholder",
            ),
            required: true,
        },
    ];
};
