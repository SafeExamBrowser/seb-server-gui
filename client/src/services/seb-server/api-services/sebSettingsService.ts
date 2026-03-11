import * as apiService from "@/services/apiService";

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
    (await apiService.getRequest(`${baseUrl}/${examId}/examConfigMapping`))
        .data;

export const getActiveSEBClients = async (
    examId: string,
): Promise<number | null> =>
    (await apiService.getRequest(`${baseUrl}/${examId}/active-seb-clients`))
        .data;

export const getView = async (
    viewType: ViewType,
    id: string,
): Promise<SEBSettingsView> =>
    (
        await apiService.getRequest(`${baseUrl}/${id}`, {
            params: { viewType: viewType },
        })
    ).data;

export const addTableRow = async (
    id: string,
    settingName: string,
): Promise<SEBSettingsTableRowValues> =>
    (
        await apiService.postRequest(`${baseUrl}/${id}/table/row`, {
            name: settingName,
        })
    ).data;

export const deleteTableRow = async (
    id: string,
    settingName: string,
    rowIndex: number,
): Promise<SEBSettingsTableRowValues[]> =>
    (
        await apiService.deleteRequest(`${baseUrl}/${id}/table/row`, {
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
        await apiService.postRequest(`${baseUrl}/${id}`, {
            id: valueId,
            value: value,
        })
    ).data;

export const publish = async (id: string): Promise<SEBSettingsValue> =>
    (await apiService.postRequest(`${baseUrl}/${id}/publish`)).data;

export const undoChanges = async (id: string): Promise<SEBSettingsValue> =>
    (await apiService.postRequest(`${baseUrl}/${id}/undo-changes`)).data;
