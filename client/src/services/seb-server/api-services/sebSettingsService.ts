import * as newApiService from "@/services/newApiService";

import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import {
    ExamConfigMapping,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

const baseUrl = "/exam/seb-settings" as const;

const examUrlPrefix: string = "/exam/seb-settings/";
const templateUrlPrefix: string = "/exam/seb-settings/";

export const getExamConfigMapping = async (
    examId: string,
): Promise<ExamConfigMapping[]> =>
    (await newApiService.getRequest(`${baseUrl}/${examId}/examConfigMapping`))
        .data;

export const getActiveSEBClients = async (
    examId: string,
): Promise<number | null> =>
    (await newApiService.getRequest(`${baseUrl}/${examId}/active-seb-clients`))
        .data;

export const getView = async (
    viewType: ViewType,
    id: string,
): Promise<SEBSettingsView> =>
    (
        await newApiService.getRequest(`${baseUrl}/${id}`, {
            params: { viewType: viewType },
        })
    ).data;

export const addTableRow = async (
    id: string,
    settingName: string,
): Promise<SEBSettingsTableRowValues> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${id}/table/row`,
            { name: settingName },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export async function deleteTableRow(
    id: string,
    settingName: string,
    rowIndex: number,
    forExam: boolean,
): Promise<SEBSettingsTableRowValues[]> {
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
    valueId: string,
    value: string,
    forExam: boolean,
): Promise<SEBSettingsValue> {
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
): Promise<SEBSettingsValue> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/publish";
    return (
        await apiService.api.post(
            url,
            {},
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}

export async function undoChanges(
    id: string,
    forExam: boolean,
): Promise<SEBSettingsValue> {
    const url: string =
        (forExam ? examUrlPrefix : templateUrlPrefix) + id + "/undo-changes";
    return (
        await apiService.api.post(
            url,
            {},
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}
