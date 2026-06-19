import { computed, Ref } from "vue";
import {
    FormField,
    FormFieldCollection,
} from "@/components/widgets/formBuilder/types.ts";
import { useRules } from "vuetify/labs/rules";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";
import { IndicatorTransient } from "@/components/widgets/indicatorsTable/types.ts";
import i18n from "@/i18n";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useFormFieldsThreshold } from "./useFormFieldsThreshold.ts";

export const useFormFields = (indicators: Ref<IndicatorExisting[]>) => {
    const rules = useRules();

    const getFormFields = (indicator: Ref<IndicatorTransient>): FormField[] => {
        const getDefaultThresholds = (
            indicatorType: IndicatorTransient["type"],
        ): IndicatorTransient["thresholds"] => {
            switch (indicatorType) {
                case undefined:
                    return [];
                case IndicatorEnum.BATTERY_STATUS:
                    return [
                        {
                            value: 20,
                            color: "#ffc20e",
                        },
                        {
                            value: 10,
                            color: "#ed1c24",
                        },
                    ];
                case IndicatorEnum.WLAN_STATUS:
                    return [
                        {
                            value: 40,
                            color: "#ed1c24",
                        },
                    ];
                default:
                    return indicatorType satisfies never;
            }
        };

        const name = computed<IndicatorTransient["name"]>({
            get: (): IndicatorTransient["name"] => indicator.value.name,
            set: (value: IndicatorTransient["name"]) => {
                indicator.value = { ...indicator.value, name: value };
            },
        });

        const type = computed<IndicatorTransient["type"]>({
            get: (): IndicatorTransient["type"] => indicator.value.type,
            set: (value: IndicatorTransient["type"]) => {
                if (thresholds.value.length === 0) {
                    thresholds.value = getDefaultThresholds(value);
                }

                indicator.value = {
                    ...indicator.value,
                    type: value,
                };
            },
        });

        const thresholds = computed<IndicatorTransient["thresholds"]>({
            get: (): IndicatorTransient["thresholds"] =>
                indicator.value.thresholds,
            set: (value: IndicatorTransient["thresholds"]) => {
                indicator.value = {
                    ...indicator.value,
                    thresholds: value,
                };
            },
        });

        return [
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: i18n.global.t("indicators.fields.name.label"),
                placeholder: i18n.global.t(
                    "indicators.fields.name.placeholder",
                ),
                required: true,
                rules: [
                    rules.minLength(3),
                    rules.maxLength(255),
                    rules.blacklisted(
                        new Set(
                            indicators.value
                                // Blacklist names of all other indicators.
                                // Exclude current indicator, as it can already be in the list in case of editing.
                                .filter(
                                    (existingIndicator) =>
                                        existingIndicator.id !==
                                        indicator.value.id,
                                )
                                .map(
                                    (indicator: IndicatorExisting) =>
                                        indicator.name,
                                ),
                        ),
                        i18n.global.t(
                            "indicators.fields.name.validationErrorUniqueName",
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
                        `indicators.fields.type.types.${value}`,
                    ),
                })),
                label: i18n.global.t("indicators.fields.type.label"),
                placeholder: i18n.global.t(
                    "indicators.fields.type.placeholder",
                ),
                required: true,
            },
            {
                type: "collection" as const,
                name: "thresholds",
                label: i18n.global.t("indicators.fields.thresholds.label"),
                required: true,
                fieldGroups: thresholds.value.map((_, index) =>
                    useFormFieldsThreshold(thresholds, index),
                ),
                labelAdd: i18n.global.t(
                    "indicators.fields.thresholds.labelAdd",
                ),
                labelRow: i18n.global.t(
                    "indicators.fields.thresholds.labelRow",
                ),
                onAddItem: () => {
                    thresholds.value.push({
                        value: 0,
                        color: "#000000",
                    });
                },
                onRemoveItem: (itemIndex: number) => {
                    thresholds.value = thresholds.value.filter(
                        (_, index) => index !== itemIndex,
                    );
                },
            } satisfies FormFieldCollection,
        ];
    };

    return {
        getFormFields,
    };
};
