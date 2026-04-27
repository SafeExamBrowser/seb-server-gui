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
import {
    SEBSettingsSingeValueModel,
    SEBSettingsTableModel,
    SEBValueAttributes,
} from "../types";

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

        const result: SEBSettingsSingeValueModel = {
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
            getAttributes: getAttributes,
        };

        // NOTE: Special case for proxies in Network view, they came as single row tables but are
        //       in fact just single values. So we merge it in case of ViewType.NETWORK into the singe values map
        if (viewType == ViewType.NETWORK) {
            const tableValues = new Map<string, SEBSettingsTableRowValues[]>(
                Object.entries(sebSettingsView.value.tableValues),
            );
            const proxyVals = tableValues.get("proxies");
            if (proxyVals) {
                const proxyValues = new Map<string, SEBSettingsValue>(
                    Object.entries(proxyVals[0].rowValues),
                );
                proxyValues.forEach((v, k) => {
                    result.singleValues.set(k, v);
                });
            }
        }

        return result;
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

    function getStringValue(name: string): string {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return "";
        }

        return singleValue.value;
    }

    function getBooleanValue(name: string): boolean {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return false;
        }

        return stringToBoolean(singleValue.value);
    }

    function getNumberValue(name: string): number {
        const singleValue = getSingleValue(name);
        if (!singleValue) {
            return 0;
        }

        return Number(singleValue.value);
    }

    function getAttributes(
        name: string,
        labels: string | null,
    ): SEBValueAttributes[] {
        if (!singleValues.value) {
            return [];
        }
        const items: SEBValueAttributes[] = [];
        singleValues.value.attributes
            .get(name)
            ?.resources?.split(",")
            .forEach((item) => {
                items.push({
                    title:
                        labels != null ? translate(labels + "_" + item) : item,
                    value: item,
                });
            });
        return items;
    }

    async function saveSingleValue(name: string, value: string) {
        if (containerId === null) return;
        const setting = getSingleValue(name);
        if (!setting) return;
        await sebSettingsService.updateSEBSettingValue(
            containerId,
            setting.id.toString(),
            value,
            isExam,
        );

        // also update the stored value
        setting.value = value;
    }

    async function saveTableRow(values: SEBSettingTableValue[]) {
        values.forEach((tableValue) => {
            sebSettingsService.updateSEBSettingValue(
                containerId,
                tableValue.id.toString(),
                tableValue.value,
                isExam,
            );
        });
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
