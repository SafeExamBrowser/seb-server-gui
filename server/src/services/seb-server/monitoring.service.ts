import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function disableConnections(
    token: string,
    id: string,
    connectionToken: {}
): Promise<[number, any]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/disable-connection";

    try {
        const response = await apiService.api.post(
            url,
            apiService.createUrlEncodedBody(connectionToken),
            { headers: apiService.getHeaders(token) }
        );

        return [response.status, response.data];
    } catch (error: any) {

        throw error;
    }
}
