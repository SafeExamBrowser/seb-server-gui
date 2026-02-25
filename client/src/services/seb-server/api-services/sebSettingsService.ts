import * as newApiService from "@/services/newApiService";

import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import {
    ExamConfigMapping,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

const baseUrl = "/exam/seb-settings" as const;

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

export const publish = async (id: string): Promise<SEBSettingsValue> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${id}/publish`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const undoChanges = async (id: string): Promise<SEBSettingsValue> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${id}/undo-changes`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;
