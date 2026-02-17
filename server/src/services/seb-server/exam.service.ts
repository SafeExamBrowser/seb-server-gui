import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import * as ENV from "../../config/envConfig";


export async function getExamConfigurationMap(token: string, id: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_CONFIGURATION_MAP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

export async function getExamAppSignatureKeys(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + id + constants.KEY_INFO_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function getGrantedExamAppSignatureKeys(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + id + constants.GRANT_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
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


export async function createExam(token: string, newExam: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE;
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(newExam), {headers: apiService.getHeaders(token)});
    
    return [data, status];
}

export async function updateExam(token: string, updatedExam: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE;
    const {data, status} = await apiService.api.put(url, updatedExam, {headers: apiService.getApplicationJsonHeaders(token)});
    
    return [data, status];
}

export async function deleteExam(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + id;
    const {data, status} = await apiService.api.delete(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getExams(token: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
} 

export async function getExamsForMonitoring(token: string, options?: {}): Promise<[object, number]>{
    const url: string = "/monitoring";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
} 

//todo: check why this method with config object works and the defautl one does not
export async function archiveExam(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_ROUTE + "/" + id + "/archive";
    // const {data, status} = await apiService.api.patch(url, {headers: apiService.getPatchHeaders(token)});

    let config = {
        method: 'patch',
        url: ENV.SEB_SERVER_URL + ENV.SEB_SERVER_PORT + ENV.SEB_SERVER_DEFAULT_URL + url,
        headers: apiService.getPatchHeaders(token)
      };

    const {data, status} = await apiService.api.request(config)



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