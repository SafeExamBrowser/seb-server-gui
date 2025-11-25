import { FormFieldSimple } from "@/components/widgets/formBuilder/types";
import { computed } from "vue";
import { Threshold } from "@/models/seb-server/examTemplate";

export const useFormFieldsThreshold = (
    threshold: Threshold,
): FormFieldSimple[] => {
    // TODO @alain: casting strings and numbers like that is not good. Adapt, once a proper number form field is available in the form builder.
    const value = computed<string>({
        get: (): string => threshold.value.toString(),
        set: (value: string) => {
            threshold = { ...threshold, value: Number(value) };
        },
    });

    const color = computed<Threshold["color"]>({
        get: (): Threshold["color"] => threshold.color,
        set: (value: Threshold["color"]) => {
            threshold = { ...threshold, color: value };
        },
    });

    return [
        {
            type: "text" as const,
            name: "value",
            model: value,
            label: "Value", // TODO @alain: i18n
        },
        {
            type: "text" as const,
            name: "color",
            model: color,
            label: "Color", // TODO @alain: i18n
        },
    ];
};
