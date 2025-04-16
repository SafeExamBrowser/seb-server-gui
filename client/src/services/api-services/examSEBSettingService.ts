import * as apiService from "@/services/api-services/apiService";

const urlPrefix: string = "/exam/seb-settings/";

export async function getApplicationView(id: string): Promise<SEBSettingsView | any>{
    const url: string = urlPrefix + id + "/APPLICATION";
    return (await apiService.api.get(url, {headers: apiService.getHeaders()})).data;
}

export async function getNetworkView(id: string): Promise<SEBSettingsView | any>{
    const url: string = urlPrefix + id + "/NETWORK";
    return (await apiService.api.get(url, {headers: apiService.getHeaders()})).data;
}

export async function addTableRow(id: string, settingName: string): Promise<SEBSettingsTableRowValues | any>{
    const url: string = urlPrefix + id + "/";
    return (await apiService.api.post(url, { settingName: settingName }, {headers: apiService.getHeaders()})).data;
}

export async function deleteTableRow(id: string, settingName: string, rowIndex: number): Promise<SEBSettingsTableRowValues[] | any>{
    const url: string = urlPrefix + id + "/table/" + settingName + "/row/" + rowIndex;
    return (await apiService.api.delete(url, {headers: apiService.getHeaders()})).data;
}

export async function updateSEBSettingValue(id: string, valueId: String, value: string): Promise<SEBSettingsValue | any>{
    const url: string = urlPrefix + id + "/";
    return (await apiService.api.post(url, { valueId: valueId, value: value }, {headers: apiService.getPostHeaders()})).data;
}

