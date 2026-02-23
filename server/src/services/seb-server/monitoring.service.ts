import * as apiService from "./api.service";
import * as constants from "../../utils/constants";


export async function applyTestRun(token: string, id: string): Promise<[object, number]>{
    const url: string = constants.MONITORING_TEST_RUN_ROUTE + "/" + id;
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});
    
    return [data, status];
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


export async function getConnections(token: string, id: string, optionalHeaders: {}): Promise<[object, number]> {
    const url: string = constants.MONITORING_CONNECTIONS_ROUTE + "/" + id;
    const { data, status } = await apiService.api.get(
        url,
        {
            headers: {
                ...apiService.getHeaders(token),
                ...optionalHeaders,
            }
        }
    );

    return [data, status];
}

export async function getSingleConnection(token: string, id: string, connectionToken: string): Promise<[object, number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/" + connectionToken;
    const { data, status } = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    return [data, status];
}

export async function getClientEventLogs(
    token: string,
    connectionId: string,
    options?: any
): Promise<[object, number]> {
    let parsedOptions: Record<string, any> = {};

    if (typeof options === 'string') {
        try {
            parsedOptions = JSON.parse(options);
        } catch (e) {
            throw new Error("Invalid optionalParameters JSON");
        }
    } else if (Array.isArray(options)) {
        throw new Error("Invalid optionalParameters format: array is not supported");
    } else if (typeof options === 'object' && options !== null) {
        parsedOptions = options as Record<string, any>;
    }

    const params: Record<string, any> = {
        ...parsedOptions,
        clientConnectionId: connectionId
    }

    const { data, status } = await apiService.api.get(
        constants.MONITORING_LOGS_ROUTE,
        {
            headers: apiService.getHeaders(token),
            params
        }
    );

    return [data, status];
}



export async function getStaticClientData(token: string, id: string, modelIds: {}): Promise<[object, number]>{
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/static-client-data";
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(modelIds), {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function registerInstruction(
    token: string,
    id: string,
    clientInstruction: {}
): Promise<[number, any]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/instruction";
    try {
        const response = await apiService.api.post(url, clientInstruction, {
            headers: apiService.getApplicationJsonHeaders(token),
        });
        return [response.status, response.data];
    }
    catch (error: any) {
        throw error;
    }
}

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
