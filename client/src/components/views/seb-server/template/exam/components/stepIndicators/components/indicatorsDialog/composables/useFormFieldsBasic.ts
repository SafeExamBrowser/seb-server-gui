import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import i18n from "@/i18n";
import { RuleAliases } from "vuetify/labs/rules";
import {
    Indicator,
    IndicatorTransient,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";

export const useFormFieldsBasic = (
    indicator: Ref<IndicatorTransient>,
    rules: RuleAliases,
): FormField[] => {
    const stepIndicatorsStore = useStepIndicatorsStore();

    const name = computed<IndicatorTransient["name"]>({
        get: (): IndicatorTransient["name"] => indicator.value.name,
        set: (value: IndicatorTransient["name"]) => {
            indicator.value = { ...indicator.value, name: value };
        },
    });

    return [
        {
            type: "text" as const,
            name: "name",
            model: name,
            label: i18n.global.t(
                "createTemplateExam.steps.indicators.fields.name.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.indicators.fields.name.placeholder",
            ),
            required: true,
            rules: [
                rules.minLength(3),
                rules.maxLength(255),
                rules.blacklisted(
                    new Set(
                        stepIndicatorsStore.indicators
                            // Blacklist names of all other indicators in the store.
                            // Exclude current indicator, as it can already be in the store in case of editing.
                            .filter(
                                (existingIndicator) =>
                                    existingIndicator.id !== indicator.value.id,
                            )
                            .map((indicator: Indicator) => indicator.name),
                    ),
                    i18n.global.t(
                        "createTemplateExam.steps.indicators.fields.name.validationErrorUniqueName",
                    ),
                ),
            ],
        },
    ];
};
