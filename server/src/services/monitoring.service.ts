import * as apiService from "./api.service";
import * as constants from "../utils/constants";

export async function applyTestRun(token: string, id: string): Promise<[object, number]>{
    const url: string = constants.MONITORING_TEST_RUN_ROUTE + "/" + id;
    const {data, status} = await apiService.api.post(url, {}, {headers: apiService.getHeaders(token)});
    
    return [data, status];
}

export async function getOverview(token: string, id: string): Promise<[object, number]>{
    const url: string = "/monitoring/overview/" + id;
    // const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});

    const data = {
        "clientStates": {
            "total": 200,
            "READY": 50,
            "CLOSED": 50,
            "ACTIVE": 100
            //ConnectionStatus enum
        },
        "clientGroups": [
            //type is enum ClientGroupType --> add new type "SP_FALLBACK_GROUP"
            {
                "id": 16,
                "name": "group1",
                "clientAmount": 50,
                "screenProctoring": true,
                "type": "CLIENT_OS",
                "typeValue": "WINDOWS"
            },
            {
                "id": 17,
                "name": "group2",
                "clientAmount": 20,
                "screenProctoring": true,
                "type": "IP_V4_RANGE",
                "typeValue": "127.0.0.1 - 127.0.0.2"
            },
            {
                "id": 18,
                "name": "group3",
                "clientAmount": 150,
                "screenProctoring": false,
                "type": "NAME_ALPHABETICAL_RANGE",
                "typeValue": "A - Z"
            },
            
            {
                "id": 32,
                "name": "SP Group",
                "clientAmount": 0,
                "screenProctoring": true,
                "type": "SP_FALLBACK_GROUP",
                "typeValue": ""
            },
        ],
        "indicators": {
            "BATTERY_STATUS": 50,
            "WLAN_STATUS": 50,
            //IndicatorType enum
        },
        "notifications": {
            "LOCK_SCREEN": 1,
            "RAISE_HAND": 3
            // NotificationType enum
        }
    };
    
    return [data, 200];
}


export async function getFullPage(token: string, id: string, optionalHeaders: {}): Promise<[object, number]> {
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/fullpage";
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

export async function getStaticClientData(token: string, id: string, modelIds: {}): Promise<[object, number]>{
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/static-client-data";
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(modelIds), {headers: apiService.getHeaders(token)});
    return [data, status];
}