import { FormFieldSimple } from "@/components/widgets/formBuilder/types";
import { ref } from "vue";

export const useFormFieldsThreshold = (): FormFieldSimple[] => {
    return [
        {
            type: "text" as const,
            name: "value",
            model: ref<string>("0"), // TODO @alain: sync this with the threshold collection
            label: "Value", // TODO @alain: i18n
        },
        {
            type: "text" as const,
            name: "color",
            model: ref<string>("#000000"), // TODO @alain: sync this with the threshold collection
            label: "Color", // TODO @alain: i18n
        },
    ];
};
