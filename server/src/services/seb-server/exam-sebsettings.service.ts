import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function updateSEBSettingsValue(token: string, examId: string, valueId: string, value: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody({ id: valueId, value: value }), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function publishSettings(token: string, examId: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/publish"
    const {data, status} = await apiService.api.post(url, "", {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function undoChanges(token: string, examId: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/undo-changes"
    const {data, status} = await apiService.api.post(url, "", {headers: apiService.getHeaders(token)});
    return [data, status];
}