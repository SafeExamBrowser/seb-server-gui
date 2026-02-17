import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import * as ENV from "../../config/envConfig";


export async function getExamConfigurationMap(token: string, id: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_CONFIGURATION_MAP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function grantExamAppSignatureKey(token: string, parentId: string,  id: string, tag: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + parentId + constants.GRANT_ROUTE + "/" + id;
    const { data, status } = await apiService.api.post(
        url,
        null,
        {
            headers: apiService.getPutHeaders(token),
            params: {
                ...(tag ? { tag } : {})
            },
        }
    );    return [data, status];
}

export async function removeGrantExamAppSignatureKey(token: string, parentId: string,  id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + parentId + constants.GRANT_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function putSEBLock(token: string, id: string){
    const url: string =  "/exam/" + id + "/seb-restriction";
    const {data, status} = await apiService.api.put(url, {}, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function checkSEBLock(token: string, id: string){
    const url: string =  "/exam/" + id + "/check-seb-restriction";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function deleteSEBLock(token: string, id: string){
    const url: string =  "/exam/" + id + "/seb-restriction";
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}