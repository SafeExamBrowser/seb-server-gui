import * as apiService from "../../services/seb-server/api.service";

export async function logLogin(token: string){
    const url: string = "/useraccount/loglogin";

    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}

export async function logLogout(token: string){
    const url: string = "/useraccount/loglogout";
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});

    return data;
}