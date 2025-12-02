import { FormFieldGroup } from "@/components/widgets/formBuilder/types";
import { computed, Ref } from "vue";
import { Threshold } from "@/models/seb-server/examTemplate";
import i18n from "@/i18n";

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
                required: true,
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.fields.value.label",
                ),
                placeholder: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.fields.value.placeholder",
                ),
                min: 0,
                max: 100,
            },
            {
                type: "color" as const,
                name: "color",
                model: color,
                required: true,
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.fields.color.label",
                ),
                placeholder: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.fields.color.placeholder",
                ),
            },
        ],
    };
};
