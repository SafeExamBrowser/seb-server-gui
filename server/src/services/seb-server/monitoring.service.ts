import * as apiService from "./api.service";
import * as constants from "../../utils/constants";

export async function quitAll(
    token: string,
    id: string
): Promise<[number, any]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/quitAll";
    try {
        const response = await apiService.api.post(url, "", {
            headers: apiService.getHeadersNoContentType(token),
        });
        return [response.status, response.data];
    }
    catch (error: any) {
        throw error;
    }
}

export async function getPendingNotifications(token: string, id: string, connectionToken: string): Promise<[object, number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/notification/" + connectionToken;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function confirmNotification(token: string, id: string, notificationId: string, connectionToken: string): Promise<[number, any]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/notification/" + notificationId + "/" + connectionToken;
    const {data, status} = await apiService.api.post(url, "", {headers: apiService.getHeaders(token)});
    return [status, data];
}

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
