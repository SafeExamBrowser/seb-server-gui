import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const examUrlPrefix: string = "/exam/seb-settings/";
const templateUrlPrefix: string = "/exam/seb-settings/";

export async function getExamConfigMapping(
    examId: string,
): Promise<ExamConfigMapping[] | any> {
    const url: string = examUrlPrefix + examId + "/examConfigMapping";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getActiveSEBClients(
    examId: string,
): Promise<number | any> {
    const url: string = examUrlPrefix + examId + "/active-seb-clients";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getView(
    viewType: ViewType,
    id: string,
    forExam: boolean,
): Promise<SEBSettingsView | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/" + viewType;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function addTableRow(
    id: string,
    settingName: string,
    forExam: boolean,
): Promise<SEBSettingsTableRowValues | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) +
        id +
        "/table/" +
        settingName +
        "/row";
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
    forExam: boolean,
): Promise<SEBSettingsTableRowValues[] | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) +
        id +
        "/table/" +
        settingName +
        "/row/" +
        rowIndex;
    return (
        await apiService.api.delete(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function updateSEBSettingValue(
    id: string,
    valueId: String,
    value: string,
    forExam: boolean,
): Promise<SEBSettingsValue | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/";
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

export async function publish(
    id: string,
    forExam: boolean,
): Promise<Exam | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/publish";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function undoChanges(
    id: string,
    forExam: boolean,
): Promise<Exam | any> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/undo-changes";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}
