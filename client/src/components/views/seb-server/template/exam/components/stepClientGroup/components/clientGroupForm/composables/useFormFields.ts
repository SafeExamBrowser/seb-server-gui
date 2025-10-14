import { computed, ModelRef } from "vue";
import { FormField } from "@/components/widgets/form/types";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useI18n } from "vue-i18n";

export const useFormFields = (clientGroup: ModelRef<ClientGroup>) => {
    const { t } = useI18n();

    const name = computed<string>({
        get: () => clientGroup.value.name,
        set: (value) => {
            clientGroup.value = { ...clientGroup.value, name: value };
        },
    });

    const formFields: FormField[] = [
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
    ];

    return {
        formFields,
    };
};
