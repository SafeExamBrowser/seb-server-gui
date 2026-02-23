import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function activateScreenProctoring(token: string, id: string, enableScreenProctoring: {}){
    const url: string =  "/exam/" + id + "/screen-proctoring/activation";

    console.log(url)
    console.log(enableScreenProctoring)

    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token), params: {enableScreenProctoring: enableScreenProctoring}});
    return [data, status];
}