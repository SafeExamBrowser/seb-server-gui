import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { useFetchViewValues } from "./api/useFetchViewValues";
import { computed } from "vue";
import { stringToBoolean } from "@/utils/generalUtils";
import { translate } from "@/utils/generalUtils";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService";
import {
    SEBSettingsValue,
    SEBSettingAttribute,
    SEBSettingsTableRowValues,
    SEBSettingTableValue,
} from "@/models/seb-server/sebSettings";

// Singe SEB Setting values model encapsulates single SEB Setting values with its current ids
// mapped by SEB Setting names and additional attributes also mapped to SEB Setting names.
// Also provides some value accessors and a persistent function to save the value to backend
export type SEBSettingsSingeValueModel = {
    singleValues: Map<string, SEBSettingsValue>;
    attributes: Map<string, SEBSettingAttribute>;

    getStringValue(name: string): string;
    getBooleanValue(name: string): boolean;
    getNumberValue(name: string): number;
    saveSingleValue(name: string, value: string): void;
};

// SEB Settings table model encapsulates table row values mapped by SEB Setting names
// and additional attributes also mapped to SEB Setting names.
// Also provides some row value accessors and a persistent function to save the value to backend
export type SEBSettingsTableModel = {
    tableValues: Map<string, SEBSettingsTableRowValues[]>;
    attributes: Map<string, SEBSettingAttribute>;

    addTableRow(name: string): Promise<SEBSettingsTableRowValues | null>;
    deleteTableRow(
        name: string,
        index: number,
    ): Promise<SEBSettingsTableRowValues[] | null>;
    saveTableRow(values: SEBSettingTableValue[]): void;
    applyAttributes(
        name: string,
        labels: string | null,
        items: { title: string; value: string }[],
    ): void;
};

export const useSEBSettingValues = (
    isExam: boolean,
    containerId: string,
    viewType: ViewType,
) => {
    const {
        data: sebSettingsView,
        loading: loadingSebSettingsView,
        error: errorFetchSebSettingsView,
    } = useFetchViewValues(isExam, containerId, viewType);

    const singleValues = computed(() => {
        if (!sebSettingsView.value) {
            return undefined;
        }

        return {
            singleValues: new Map<string, SEBSettingsValue>(
                Object.entries(sebSettingsView.value.singleValues),
            ),
            attributes: new Map<string, SEBSettingAttribute>(
                Object.entries(sebSettingsView.value.attributes),
            ),

            getStringValue: getStringValue,
            getBooleanValue: getBooleanValue,
            getNumberValue: getNumberValue,
            saveSingleValue: saveSingleValue,
        } as SEBSettingsSingeValueModel;
    });

    const tableValues = computed(() => {
        if (!sebSettingsView.value) {
            return undefined;
        }

        return {
            tableValues: new Map<string, SEBSettingsTableRowValues[]>(
                Object.entries(sebSettingsView.value.tableValues),
            ),
            attributes: new Map<string, SEBSettingAttribute>(
                Object.entries(sebSettingsView.value.attributes),
            ),

            addTableRow: addTableRow,
            deleteTableRow: deleteTableRow,
            saveTableRow: saveTableRow,
            applyAttributes: applyAttributes,
        } as SEBSettingsTableModel;
    });

    const errorSebSettingsView = computed(() =>
        [errorFetchSebSettingsView.value].filter(
            (error) => error !== undefined,
        ),
    );

    function getSingleValue(name: string): SEBSettingsValue | undefined {
        if (!singleValues.value) {
            return undefined;
        }

        return singleValues.value.singleValues.get(name);
    }

    function getStringValue(name: string): string | undefined {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return undefined;
        }

        return singleValue.value;
    }

    function getBooleanValue(name: string): boolean | undefined {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return undefined;
        }

        return stringToBoolean(singleValue.value);
    }

    function getNumberValue(name: string): number | undefined {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return undefined;
        }

        return Number(singleValue.value);
    }

    function applyAttributes(
        name: string,
        labels: string | null,
        items: { title: string; value: string }[],
    ) {
        if (!tableValues.value) {
            return undefined;
        }
        tableValues.value.attributes
            .get(name)
            ?.resources?.split(",")
            .forEach((item) => {
                items.push({
                    title:
                        labels != null ? translate(labels + "_" + item) : item,
                    value: item,
                });
            });
    }

    async function saveSingleValue(name: string, value: string) {
        if (containerId === null) return;
        const setting = getSingleValue(name);
        if (!setting) return;
        try {
            await sebSettingsService.updateSEBSettingValue(
                containerId,
                setting.id.toString(),
                value,
                isExam,
            );
        } catch (err) {
            // @anhefti TODO propagate error message
            console.error(err);
        }
    }

    async function saveTableRow(values: SEBSettingTableValue[]) {
        try {
            values.forEach((tableValue) => {
                sebSettingsService.updateSEBSettingValue(
                    containerId,
                    tableValue.id.toString(),
                    tableValue.value,
                    isExam,
                );
            });
        } catch (err) {
            // @anhefti TODO propagate error message
            console.error(err);
        }
    }

    async function addTableRow(
        name: string,
    ): Promise<SEBSettingsTableRowValues | null> {
        return await sebSettingsService.addTableRow(containerId, name, isExam);
    }

    async function deleteTableRow(
        name: string,
        index: number,
    ): Promise<SEBSettingsTableRowValues[] | null> {
        return await sebSettingsService.deleteTableRow(
            containerId,
            name,
            index,
            isExam,
        );
    }

    return {
        singleValues,
        tableValues,
        loadingSebSettingsView,
        errorSebSettingsView,
    };
};
