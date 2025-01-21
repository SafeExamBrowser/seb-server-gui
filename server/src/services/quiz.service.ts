import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function getQuizzes(token: string, options?: {}): Promise<[object, number]>{

    console.log(options)

    const url: string =  constants.QUIZ_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}

// export async function getGroupByUuid(token: string, uuid: string, options?: {}): Promise<object>{
//     const url: string =  groupUrl + "/" + uuid;
//     const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

//     return data;
// }