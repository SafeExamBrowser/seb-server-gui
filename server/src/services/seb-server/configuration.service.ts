import * as apiService from "./api.service";
import * as constants from "../../utils/constants";



export async function createConnectionConfiguration(token: string, newConnectionConfiguration: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.post(constants.CONNECTION_CONFIG_ROUTE, apiService.createUrlEncodedBody(newConnectionConfiguration), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function deleteConnectionConfiguration(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.CONNECTION_CONFIG_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}


export async function editConnectionConfiguration(token: string, editConnectionConfigurationPars: {}): Promise<[object, number]> {
    const headers = apiService.getPutHeaders(token);
    const { data, status } = await apiService.api.put(
        constants.CONNECTION_CONFIG_ROUTE,
        editConnectionConfigurationPars,
        { headers }
    );
    return [data, status];
}