import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import {
    getEmptyIndicator,
    useStepIndicatorsStore,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/useFormFields";
import {
    Indicator,
    IndicatorTransient,
    indicatorTransientToIndicator,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import { CrudTableConfig } from "@/components/widgets/crud/types";

export const useTable = (): CrudTableConfig<Indicator, IndicatorTransient> => {
    const { indicators } = storeToRefs(useStepIndicatorsStore());
    const { deleteIndicator, createIndicator, updateIndicator } =
        useStepIndicatorsStore();
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

    const updateItem = (item: IndicatorTransient) => {
        updateIndicator(indicatorTransientToIndicator(item));
    };

    const getExistingItem = (item: Indicator): IndicatorTransient => ({
        ...item,
    });

    return {
        name: "indicators",
        title: i18n.global.t("indicators.entityNamePlural"),
        headers,
        items: indicators,
        getFormFields,
        createConfig: {
            title: i18n.global.t("indicators.addDialogTitle"),
            allowed: true,
            getNewItem: getEmptyIndicator,
            createItem,
        },
        updateConfig: {
            title: i18n.global.t("indicators.editDialogTitle"),
            getExistingItem,
            updateItem,
        },
        deleteConfig: {
            deleteItem: deleteIndicator,
        },
    };
};
