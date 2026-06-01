import i18n from "@/i18n";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";
import {
    IndicatorsTableDeps,
    IndicatorTransient,
    indicatorTransientToIndicator,
} from "@/components/widgets/indicatorsTable/types.ts";
import { useFormFields } from "@/components/widgets/indicatorsTable/composables/useFormFields.ts";
import { CrudTableConfig } from "@/components/widgets/crudTable/types.ts";

export const getEmptyIndicator = (): IndicatorTransient => ({
    id: crypto.getRandomValues(new Uint32Array(1))[0], // random ID, for FE use only (when submitting to BE, the BE will generate the real ID)
    thresholds: [],
});

export const useTable = (
    deps: IndicatorsTableDeps,
): CrudTableConfig<IndicatorExisting, IndicatorTransient> => {
    const { getFormFields } = useFormFields(deps.indicators);

    const headers = [
        {
            title: i18n.global.t("indicators.fields.name.label"),
            value: "name",
            width: "30%",
        },
        {
            title: i18n.global.t("indicators.fields.type.label"),
            value: "type",
            width: "30%",
        },
        {
            title: i18n.global.t("indicators.fields.thresholds.label"),
            value: "thresholds",
            width: "30%",
        },
        {
            title: i18n.global.t("indicators.fields.actions.label"),
            value: "actions",
            align: "end" as const,
            width: "10%",
        },
    ];

    const createItem = (item: IndicatorTransient) =>
        deps.createItem(indicatorTransientToIndicator(item));

    const updateItem = (item: IndicatorTransient) =>
        deps.updateItem(indicatorTransientToIndicator(item));

    const getExistingItem = (item: IndicatorExisting): IndicatorTransient => ({
        ...item,
    });

    return {
        name: "indicators",
        title: i18n.global.t("indicators.entityNamePlural"),
        headers,
        items: deps.indicators,
        getFormFields,
        createConfig: {
            title: i18n.global.t("indicators.addDialogTitle"),
            allowed: true,
            getItem: getEmptyIndicator,
            createItem,
        },
        updateConfig: {
            title: i18n.global.t("indicators.editDialogTitle"),
            getItem: getExistingItem,
            updateItem,
        },
        deleteConfig: {
            deleteItem: deps.deleteItem,
            confirm: deps.confirmDelete
                ? {
                      translationKeyPrefix: "indicators",
                      getDetailText: (item: IndicatorExisting) => item.name,
                  }
                : undefined,
        },
    };
};
