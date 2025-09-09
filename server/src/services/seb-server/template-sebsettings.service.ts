import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getView(token: string, templateId: string, viewType: string): Promise<[object, number]>{
    const url: string =  constants.TEMPLATE_SEB_SETTINGS_ENDPOINT + "/" + templateId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: { viewType: viewType }});
    return [data, status];
}

export async function addTableRow(token: string, templateId: string, params: {}) {
    const url: string =  constants.TEMPLATE_SEB_SETTINGS_ENDPOINT + "/" + templateId + "/table/row";
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(params), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function deleteTableRow(token: string, templateId: string, params: {}) {
    const url: string =  constants.TEMPLATE_SEB_SETTINGS_ENDPOINT + "/" + templateId + "/table/row";
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token), params});
    return [data, status];
}

export async function updateSEBSettingsValue(token: string, templateId: string, valueId: string, value: string) {
    const url: string =  constants.TEMPLATE_SEB_SETTINGS_ENDPOINT + "/" + templateId;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody({ id: valueId, value: value }), {headers: apiService.getHeaders(token)});
    return [data, status];
}