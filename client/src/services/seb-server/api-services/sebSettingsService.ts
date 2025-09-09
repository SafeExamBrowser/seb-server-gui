import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";


const examUrlPrefix: string = "/exam/seb-settings/";
const templateUrlPrefix: string = "/exam/seb-settings/";

export async function getExamConfigMapping(examId: string): Promise<ExamConfigMapping[] | any> {
    const url: string = examUrlPrefix + examId + "/examConfigMapping";
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function getView(viewType: ViewType, id: string, forExam: boolean): Promise<SEBSettingsView | any>{
    console.info("************ viewType: " + viewType);
    const url: string = (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/" + viewType;
    console.info("************ getView: " + url);
    return (await apiService.api.get(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function addTableRow(id: string, settingName: string, forExam: boolean): Promise<SEBSettingsTableRowValues | any>{
    const url: string = forExam ? examUrlPrefix : templateUrlPrefix + id + "/table/" + settingName + "/row";
    return (await apiService.api.post(url, { settingName: settingName }, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function deleteTableRow(id: string, settingName: string, rowIndex: number, forExam: boolean): Promise<SEBSettingsTableRowValues[] | any>{
    const url: string = forExam ? examUrlPrefix : templateUrlPrefix + id + "/table/" + settingName + "/row/" + rowIndex;
    return (await apiService.api.delete(url, {headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}

export async function updateSEBSettingValue(id: string, valueId: String, value: string, forExam: boolean): Promise<SEBSettingsValue | any>{
    const url: string = forExam ? examUrlPrefix : templateUrlPrefix + id + "/";
    return (await apiService.api.post(url, { valueId: valueId, value: value }, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)})).data;
}