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

export const deleteTableRow = async (
    id: string,
    settingName: string,
    rowIndex: number,
): Promise<SEBSettingsTableRowValues[]> =>
    (
        await newApiService.deleteRequest(`${baseUrl}/${id}/table/row`, {
            name: settingName,
            listIndex: rowIndex,
        })
    ).data;

export const updateSEBSettingValue = async (
    id: string,
    valueId: string,
    value: string,
): Promise<SEBSettingsValue> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${id}`,
            { id: valueId, value: value },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

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
