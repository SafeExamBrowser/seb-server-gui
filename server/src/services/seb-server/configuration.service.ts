import * as apiService from "./api.service";
import * as constants from "../../utils/constants";



export async function createConnectionConfiguration(token: string, newConnectionConfiguration: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(constants.CONNECTION_CONFIG_ROUTE, apiService.createUrlEncodedBody(newConnectionConfiguration), {headers: apiService.getHeaders(token)});
    return [data, status];
}


export async function downloadExamConfig(token: string, connectionId: string, examId: {}): Promise<[object, number]>{
    const url: string =  constants.DOWNLOAD_EXAM_CONFIG_ROUTE + "/" + connectionId;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getOctetStreamHeaders(token), params: {id: examId}, responseType: "arraybuffer"});

    return [data, status];
}

export async function getConnectionConfigurationsActive(token: string, isActive: {}){
    const url: string =  constants.CONNECTION_CONFIG_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: {active: isActive}});

    return [data, status];
}

export async function getConnectionConfigurations(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.CONNECTION_CONFIG_ROUTE, {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}

export async function getConnectionConfiguration(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.CONNECTION_CONFIG_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}


export async function deactivateConnectionConfiguration(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.CONNECTION_CONFIG_ROUTE + "/" + id + constants.DEACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(url, apiService.createUrlEncodedBody(body), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function activateConnectionConfiguration(token: string, id: string, body: Record<string, any> = {}): Promise<[object, number]> {
    const url: string = constants.CONNECTION_CONFIG_ROUTE + "/" + id + constants.ACTIVATION_ROUTE;
    const { data, status } = await apiService.api.post(url, apiService.createUrlEncodedBody(body), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function deleteConnectionConfiguration(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.CONNECTION_CONFIG_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}