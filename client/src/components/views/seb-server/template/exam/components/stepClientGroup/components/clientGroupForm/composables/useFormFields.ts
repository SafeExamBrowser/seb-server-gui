import { computed, ModelRef } from "vue";
import { FormField } from "@/components/widgets/form/types";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

export const useFormFields = (clientGroup: ModelRef<ClientGroup>) => {
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
            label: "TODO: name", // TODO @alain: i18n
            placeholder: "TODO: placeholder", // TODO @alain: i18n
            required: true,
        },
    ];

    return {
        formFields,
    };
};
