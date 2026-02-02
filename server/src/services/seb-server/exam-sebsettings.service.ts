import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getExamConfigMapping(token: string, examId: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/examConfigMapping";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getView(token: string, examId: string, viewType: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: { viewType: viewType }});
    return [data, status];
}

export async function addTableRow(token: string, examId: string, params: {}): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/table/row";
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(params), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function deleteTableRow(token: string, examId: string, params: {}): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/table/row";
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token), params});
    return [data, status];
}

export async function updateSEBSettingsValue(token: string, examId: string, valueId: string, value: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody({ id: valueId, value: value }), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getActiveSEBClients(token: string, examId: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/active-seb-clients"
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function publishSettings(token: string, examId: string): Promise<[object, number]> {
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/publish"
    const {data, status} = await apiService.api.post(url, "", {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function undoChanges(token: string, examId: string): Promise<[object, number]> {
    console.info("*********** exam-sebsettings.service token: " + token);
    const url: string =  constants.EXAM_SEB_SETTINGS_ENDPOINT + "/" + examId + "/undo-changes"
    const {data, status} = await apiService.api.post(url, "", {headers: apiService.getHeaders(token)});
    return [data, status];
}