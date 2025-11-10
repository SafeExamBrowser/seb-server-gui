import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";

export const useTable = () => {
    const { indicators } = storeToRefs(useStepIndicatorsStore());

    const headers = [
        {
            title: i18n.global.t(
                "createTemplateExam.steps.indicators.fields.name.label",
            ),
            value: "name",
            width: "45%",
        },
        {
            title: i18n.global.t(
                "createTemplateExam.steps.indicators.fields.type.label",
            ),
            value: "type",
            width: "45%",
        },
        {
            title: i18n.global.t(
                "createTemplateExam.steps.indicators.fields.actions.label",
            ),
            value: "actions",
            align: "end" as const,
            width: "10%",
        },
    ].filter((header) => header !== undefined);

    return {
        headers,
        items: indicators,
    };
};
