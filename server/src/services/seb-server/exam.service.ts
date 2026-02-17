import * as apiService from "./api.service";
import * as constants from "../../utils/constants";
import * as ENV from "../../config/envConfig";


export async function getExamConfigurationMap(token: string, id: string, options?: {}): Promise<[object, number]>{
    const url: string =  constants.EXAM_CONFIGURATION_MAP_ROUTE + "/" + id;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token), params: options});

    return [data, status];
}
