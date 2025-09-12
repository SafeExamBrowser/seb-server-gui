import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const urlPrefix: string = "/exam/seb-settings/";

export async function getExamConfigMapping(
    examId: string,
): Promise<ExamConfigMapping[] | any> {
    const url: string = urlPrefix + examId + "/examConfigMapping";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getApplicationView(
    id: string,
): Promise<SEBSettingsView | any> {
    const url: string = urlPrefix + id + "/APPLICATION";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getNetworkView(
    id: string,
): Promise<SEBSettingsView | any> {
    const url: string = urlPrefix + id + "/NETWORK";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function addTableRow(
    id: string,
    settingName: string,
): Promise<SEBSettingsTableRowValues | any> {
    const url: string = urlPrefix + id + "/table/" + settingName + "/row";
    return (
        await apiService.api.post(
            url,
            { settingName },
            { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) },
        )
    ).data;
}

export async function deleteTableRow(
    id: string,
    settingName: string,
    rowIndex: number,
): Promise<SEBSettingsTableRowValues[] | any> {
    const url: string =
        urlPrefix + id + "/table/" + settingName + "/row/" + rowIndex;
    return (
        await apiService.api.delete(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function updateSEBSettingValue(
    id: string,
    valueId: string,
    value: string,
): Promise<SEBSettingsValue | any> {
    const url: string = urlPrefix + id + "/";
    return (
        await apiService.api.post(
            url,
            { valueId, value },
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}
