import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getExamTemplate(token: string, id: string): Promise<[object, number]>{
    const url: string =  constants.EXAM_TEMPLATE_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}
