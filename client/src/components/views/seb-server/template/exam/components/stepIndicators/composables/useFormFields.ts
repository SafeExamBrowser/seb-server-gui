import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { useRules } from "vuetify/labs/rules";
import {
    Indicator,
    IndicatorTransient,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import i18n from "@/i18n";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums";

export const useFormFields = () => {
    const rules = useRules();
    const stepIndicatorsStore = useStepIndicatorsStore();

    const getFormFields = (indicator: Ref<IndicatorTransient>) => {
        const name = computed<IndicatorTransient["name"]>({
            get: (): IndicatorTransient["name"] => indicator.value.name,
            set: (value: IndicatorTransient["name"]) => {
                indicator.value = { ...indicator.value, name: value };
            },
        });

        const type = computed<IndicatorTransient["type"]>({
            get: (): IndicatorTransient["type"] => indicator.value.type,
            set: (value: IndicatorTransient["type"]) => {
                indicator.value = {
                    ...indicator.value,
                    type: value,
                };
            },
        });

        const formFields = computed<FormField[]>(() => [
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
                                        existingIndicator.id !==
                                        indicator.value.id,
                                )
                                .map((indicator: Indicator) => indicator.name),
                        ),
                        i18n.global.t(
                            "createTemplateExam.steps.indicators.fields.name.validationErrorUniqueName",
                        ),
                    ),
                ],
            },

            {
                type: "select" as const,
                name: "type",
                model: type,
                options: [
                    IndicatorEnum.BATTERY_STATUS,
                    IndicatorEnum.WLAN_STATUS,
                ].map((value) => ({
                    value,
                    text: i18n.global.t(
                        `createTemplateExam.steps.indicators.fields.type.types.${value}`,
                    ),
                })),
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.type.label",
                ),
                placeholder: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.type.placeholder",
                ),
                required: true,
            },
        ]);

        return formFields.value;
    };

    return {
        getFormFields,
    };
};
