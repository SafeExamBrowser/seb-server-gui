import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function getExamTemplates(token: string, options?: {}): Promise<[object, number]>{

    console.log(options)

    const url: string =  constants.EXAM_TEMPLATE_ROUTE;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}