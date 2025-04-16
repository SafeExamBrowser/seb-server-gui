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
            "total": 250,
            "ACTIVE": 100,
            "READY": 50,
            "DISABLED": 50,
            "CONNECTION_REQUESTED": 50
            //ConnectionStatus enum
        },

        "clientGroups": [
            {
                "id": 16,
                "clientAmount": 50
            },
            {
                "id": 17,
                "clientAmount": 20
            },
            {
                "id": 18,
                "clientAmount": 150
            },
        ],

        "indicators": {
            "total": 200,
            "LAST_PING": 50,
            "ERROR_COUNT": 50,
            "WARN_COUNT": 50,
            "INFO_COUNT": 50
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


export async function getFullPage(token: string, id: string): Promise<[object, number]>{
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/fullpage";
    const {data, status} = await apiService.api.get(url, {headers: apiService.getHeaders(token)});
    
    return [data, status];
}

export async function getStaticClientData(token: string, id: string, modelIds: {}): Promise<[object, number]>{
    const url: string = constants.MONITORING_ROUTE + "/" + id + "/static-client-data";
    const {data, status} = await apiService.api.post(url, apiService.createUrlEncodedBody(modelIds), {headers: apiService.getHeaders(token)});
    return [data, status];
}