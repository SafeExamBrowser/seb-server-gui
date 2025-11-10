import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import {
    getEmptyIndicator,
    useStepIndicatorsStore,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/useFormFields";
import {
    IndicatorTransient,
    indicatorTransientToIndicator,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";

export const useTable = () => {
    const { indicators } = storeToRefs(useStepIndicatorsStore());
    const { deleteIndicator, createIndicator } = useStepIndicatorsStore();
    const { getFormFields } = useFormFields();

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

    const createItem = (item: IndicatorTransient) => {
        createIndicator(indicatorTransientToIndicator(item));
    };

    return {
        headers,
        items: indicators,
        deleteItem: deleteIndicator,
        createItem,
        getEmptyItem: getEmptyIndicator,
        getFormFields,
    };
};
