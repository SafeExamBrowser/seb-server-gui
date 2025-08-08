import * as apiService from "./api.service";
import * as constants from "../../utils/constants";


export async function applyTestRun(token: string, id: string): Promise<[object, number]>{
    const url: string = constants.MONITORING_TEST_RUN_ROUTE + "/" + id;
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});
    
    return [data, status];
}

export async function getOverview(token: string, id: string): Promise<[object, number]>{
    const url: string = "/monitoring/overview/" + id;
    const { data, status } = await apiService.api.get(url, {
        headers: apiService.getHeaders(token),
    });

    console.log("[getOverview] Response data:", data);
    console.log("[getOverview] Response status:", status);

    // const data = {
    //     "clientStates": {
    //         "total": 200,
    //         "READY": 50,
    //         "CLOSED": 50,
    //         "ACTIVE": 100
    //         //ConnectionStatus enum
    //     },
    //     "clientGroups": [
    //         //type is enum ClientGroupType --> add new type "SP_FALLBACK_GROUP"
    //         {
    //             "id": 16,
    //             "name": "group1",
    //             "clientAmount": 50,
    //             "spsGroupUUID": "7292542f-fcc6-4e79-980f-93525a5dd0d5",
    //             "type": "CLIENT_OS",
    //             "typeValue": "WINDOWS"
    //         },
    //         {
    //             "id": 17,
    //             "name": "group2",
    //             "clientAmount": 20,
    //             "spsGroupUUID": "7292542f-fcc6-4e79-980f-93525a5dd0d5",
    //             "type": "IP_V4_RANGE",
    //             "typeValue": "127.0.0.1 - 127.0.0.2"
    //         },
    //         {
    //             "id": 18,
    //             "name": "group3",
    //             "clientAmount": 150,
    //             "type": "NAME_ALPHABETICAL_RANGE",
    //             "typeValue": "A - Z"
    //         },
            
    //         {
    //             "id": 32,
    //             "name": "SP Group",
    //             "clientAmount": 0,
    //             "spsGroupUUID": "7292542f-fcc6-4e79-980f-93525a5dd0d5",
    //             "type": "SP_FALLBACK_GROUP",
    //             "typeValue": ""
    //         },
    //     ],
    //     "indicators": {
    //         "BATTERY_STATUS": 50,
    //         "WLAN_STATUS": 50,
    //         //IndicatorType enum
    //     },
    //     "notifications": {
    //         "LOCK_SCREEN": 1,
    //         "RAISE_HAND": 3
    //         // NotificationType enum
    //     }
    // };
    
    return [data, status];
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  


export async function getConnections(token: string, id: string, optionalHeaders: {}): Promise<[object, number]> {
    

    // await sleep(3000);

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

export async function registerInstruction(token: string, id: string, clientInstruction: {}): Promise<[number]>{
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/instruction";
    const {status} = await apiService.api.post(url, clientInstruction, {headers: apiService.getApplicationJsonHeaders(token)});
    return [status];
}

export async function getPendingNotifications(token: string, id: string, connectionToken: string): Promise<[object, number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/notification/" + connectionToken;
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    return [data, status];
}

export async function confirmNotification(token: string, id: string, notificationId: string, connectionToken: string): Promise<[number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/notification/" + notificationId + "/" + connectionToken;
    const {status} = await apiService.api.post(url, {headers: apiService.getHeaders(token)});
    return [status];
}

export async function disableConnections(token: string, id: string, connectionToken: {}): Promise<[number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/disable-connection";
    const {status} = await apiService.api.post(url, apiService.createUrlEncodedBody(connectionToken), {headers: apiService.getHeaders(token)});
    return [status];
}