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
    (
        await apiService.getRequest({
            url: `${baseUrl}/${examId}/examConfigMapping`,
        })
    ).data;

export const getActiveSEBClients = async (
    examId: string,
): Promise<number | null> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${examId}/active-seb-clients`,
        })
    ).data;

export const getView = async (
    viewType: ViewType,
    id: string,
): Promise<SEBSettingsView> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${id}`,
            options: {
                params: { viewType: viewType },
            },
        })
    ).data;

export const addTableRow = async (
    id: string,
    settingName: string,
): Promise<SEBSettingsTableRowValues> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${id}/table/row`,
            data: {
                name: settingName,
            },
        })
    ).data;

export const deleteTableRow = async (
    id: string,
    settingName: string,
    rowIndex: number,
): Promise<SEBSettingsTableRowValues[]> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${id}/table/row`,
            data: {
                name: settingName,
                listIndex: rowIndex,
            },
        })
    ).data;

export const updateSEBSettingValue = async (
    id: string,
    valueId: string,
    value: string,
): Promise<SEBSettingsValue> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${id}`,
            data: {
                id: valueId,
                value: value,
            },
        })
    ).data;

export const publish = async (id: string): Promise<SEBSettingsValue> =>
    (await apiService.postRequest({ url: `${baseUrl}/${id}/publish` })).data;

export const undoChanges = async (id: string): Promise<SEBSettingsValue> =>
    (await apiService.postRequest({ url: `${baseUrl}/${id}/undo-changes` }))
        .data;
