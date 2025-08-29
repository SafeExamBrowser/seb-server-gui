import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function getClientConnectionList(token: string, options?: {}): Promise<[object, number]>{
    const {data, status} = await apiService.api.get(constants.CLIENT_CONNECTION_ROUTE + "/list", {headers: apiService.getHeaders(token), params: options});
    return [data, status];
}
