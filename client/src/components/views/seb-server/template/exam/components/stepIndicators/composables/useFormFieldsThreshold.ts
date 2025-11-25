import { FormFieldSimple } from "@/components/widgets/formBuilder/types";
import { computed, Ref } from "vue";
import { Threshold } from "@/models/seb-server/examTemplate";

export const useFormFieldsThreshold = (
    thresholds: Ref<Threshold[]>,
    thresholdIndex: number,
): FormFieldSimple[] => {
    // TODO @alain: casting strings and numbers like that is not good. Adapt, once a proper number form field is available in the form builder.
    const value = computed<string>({
        get: (): string => thresholds.value[thresholdIndex].value.toString(),
        set: (value: string) => {
            thresholds.value = thresholds.value.map((threshold, index) =>
                index === thresholdIndex
                    ? { ...threshold, value: Number(value) }
                    : threshold,
            );
        },
    });

    const color = computed<Threshold["color"]>({
        get: (): Threshold["color"] => thresholds.value[thresholdIndex].color,
        set: (value: Threshold["color"]) => {
            thresholds.value = thresholds.value.map((threshold, index) =>
                index === thresholdIndex
                    ? { ...threshold, color: value }
                    : threshold,
            );
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
