import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import * as apiService from "@/services/apiService";

const examUrlPrefix: string = "/exam/seb-settings";
const templateUrlPrefix: string = "/config-template/seb-settings";

export const getActiveSEBClients = async (
    examId: string,
): Promise<number | null> =>
    (
        await apiService.getRequest({
            url: `${examUrlPrefix}/${examId}/active-seb-clients`,
            options: { _authType: "seb" },
        })
    ).data;

export const getView = async (
    viewType: ViewType,
    id: string,
    forExam: boolean,
): Promise<SEBSettingsView> =>
    (
        await apiService.getRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}`,
            options: {
                _authType: "seb",
                params: { viewType: viewType },
            },
        })
    ).data;

export const addTableRow = async (
    id: string,
    settingName: string,
    forExam: boolean,
): Promise<SEBSettingsTableRowValues> =>
    (
        await apiService.postRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}/table/row`,
            data: {
                name: settingName,
            },
            options: { _authType: "seb" },
        })
    ).data;

export const deleteTableRow = async (
    id: string,
    settingName: string,
    rowIndex: number,
    forExam: boolean,
): Promise<SEBSettingsTableRowValues[]> =>
    (
        await apiService.deleteRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}/table/row`,
            data: {
                name: settingName,
                listIndex: rowIndex,
            },
            options: { _authType: "seb" },
        })
    ).data;

export const updateSEBSettingValue = async (
    id: string,
    valueId: string,
    value: string,
    forExam: boolean,
): Promise<SEBSettingsValue> =>
    (
        await apiService.postRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}`,
            data: {
                id: valueId,
                value: value,
            },
            options: { _authType: "seb" },
        })
    ).data;

export const publish = async (
    id: string,
    forExam: boolean,
): Promise<SEBSettingsValue> =>
    (
        await apiService.postRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}/publish`,
            options: { _authType: "seb" },
        })
    ).data;

export const undoChanges = async (
    id: string,
    forExam: boolean,
): Promise<SEBSettingsValue> =>
    (
        await apiService.postRequest({
            url: `${forExam ? examUrlPrefix : templateUrlPrefix}/${id}/undo-changes`,
            options: { _authType: "seb" },
        })
    ).data;
