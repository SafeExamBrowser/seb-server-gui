import { FormFieldGroup } from "@/components/widgets/formBuilder/types";
import { computed, Ref } from "vue";
import { Threshold } from "@/models/seb-server/examTemplate";

export const useFormFieldsThreshold = (
    thresholds: Ref<Threshold[]>,
    thresholdIndex: number,
): FormFieldGroup => {
    const value = computed<Threshold["value"]>({
        get: (): Threshold["value"] => thresholds.value[thresholdIndex].value,
        set: (value: Threshold["value"]) => {
            thresholds.value = thresholds.value.map((threshold, index) =>
                index === thresholdIndex
                    ? { ...threshold, value: value }
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

    return {
        id: `threshold-${thresholdIndex}`,
        removeDisabled: thresholds.value.length <= 1,
        fields: [
            {
                type: "number" as const,
                name: "value",
                model: value,
                label: "Value", // TODO @alain: i18n
                placeholder: "Value placeholder", // TODO @alain: i18n
                min: 0,
                max: 100,
            },
            {
                type: "color" as const,
                name: "color",
                model: color,
                label: "Color", // TODO @alain: i18n
                placeholder: "Color placeholder", // TODO @alain: i18n
            },
        ],
    };
};
