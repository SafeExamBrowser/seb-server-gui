import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function registerUserAccount(body: Record<string, any>): Promise<[object, number]> {
    const { data, status } = await apiService.api.post(
        constants.USER_ACCOUNT_REGISTRATION_SERVER_ROUTE, apiService.createUrlEncodedBody(body), {headers: apiService.getHeadersWithoutAuth()});
    return [data, status];
}
