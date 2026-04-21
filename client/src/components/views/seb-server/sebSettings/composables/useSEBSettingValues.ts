import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { useFetchViewValues } from "./api/useFetchViewValues";
// import { computed } from "vue";
// import { stringToBoolean } from "@/utils/generalUtils";
// import { translate } from "@/utils/generalUtils";
// import * as sebSettingsService from "@/services/seb-server/sebSettingsService";
// import {
//     SEBSettingsValue,
//    // SEBSettingsView,
//     SEBSettingAttribute,
//     SEBSettingTableValue,
//     SEBSettingsTableRowValues,
// } from "@/models/seb-server/sebSettings";

export const useSEBSettingValues = (
    isExam: boolean,
    containerId: string,
    viewType: ViewType,
) => {
    const {
        data: sebSettingsView,
        loading: loadingSebSettingsView,
        error: errorSebSettingsView,
    } = useFetchViewValues(isExam, containerId, viewType);

    console.error("****************** fetched value ", sebSettingsView.value);

    // const singleValues = new Map<string, SEBSettingsValue>(
    //     Object.entries(sebSettingsView.value.singleValues),
    // )

    // const tableValues = computed(() => {
    //     if (!sebSettingsView.value) {
    //         return new Map<string, SEBSettingsTableRowValues[]>();
    //     }

    //     return new Map<string, SEBSettingsTableRowValues[]>(
    //         Object.entries(sebSettingsView.value.tableValues),
    //     );
    // });

    // const attributes = computed(() => {
    //     if (!sebSettingsView.value) {
    //         return new Map<string, SEBSettingAttribute>();
    //     }

    //     return new Map<string, SEBSettingAttribute>(
    //         Object.entries(sebSettingsView.value.attributes),
    //     );
    // });

    // function getSingleValue(name: string): SEBSettingsValue {
    //     const value = singleValues.get(name);
    //     if (!value) {
    //         throw new Error("No Single Value" + name + " found");
    //     }

    //     return value;
    // }

    // function getStringValue(name: string): string {
    //     return getSingleValue(name).value;
    // }

    // function getBooleanValue(name: string): boolean {
    //     return stringToBoolean(getStringValue(name));
    // }

    // function getNumberValue(name: string): number {
    //     return Number(getStringValue(name));
    // }

    // async function saveSingleValue(name: string, value: string) {
    //     if (containerId == null) return;

    //     const setting: SEBSettingsValue = getSingleValue(name);
    //     try {
    //         await sebSettingsService.updateSEBSettingValue(
    //             containerId,
    //             setting.id.toString(),
    //             value,
    //             isExam,
    //         );
    //     } catch (err) {
    //         // @anhefti TODO propagate error message
    //         console.error(err);
    //     }
    // }

    // async function saveTableRow(values: SEBSettingTableValue[]) {
    //     try {
    //         values.forEach((tableValue) => {
    //             sebSettingsService.updateSEBSettingValue(
    //                 containerId,
    //                 tableValue.id.toString(),
    //                 tableValue.value,
    //                 isExam,
    //             );
    //         });
    //     } catch (err) {
    //         // @anhefti TODO propagate error message
    //         console.error(err);
    //     }
    // }

    // async function addTableRow(
    //     name: string,
    // ): Promise<SEBSettingsTableRowValues | null> {
    //     return await sebSettingsService.addTableRow(
    //         containerId,
    //         name,
    //         isExam,
    //     );
    // }

    // async function deleteTableRow(
    //     name: string,
    //     index: number,
    // ): Promise<SEBSettingsTableRowValues[] | null> {
    //     return await sebSettingsService.deleteTableRow(
    //         containerId,
    //         name,
    //         index,
    //         isExam,
    //     );
    // }

    // function applyAttributes(
    //     name: string,
    //     labels: string | null,
    //     items: { title: string; value: string }[],
    // ) {
    //     attributes.value
    //         .get(name)
    //         ?.resources?.split(",")
    //         .forEach((item) => {
    //             items.push({
    //                 title:
    //                     labels != null ? translate(labels + "_" + item) : item,
    //                 value: item,
    //             });
    //         });
    // }

    return {
        // singleValues,
        // tableValues,
        // attributes,

        // getSingleValue,
        // getStringValue,
        // getBooleanValue,
        // getNumberValue,
        // saveSingleValue,
        // saveTableRow,
        // addTableRow,
        // deleteTableRow,
        // applyAttributes,

        loadingSebSettingsView,
        errorSebSettingsView,
    };
};
