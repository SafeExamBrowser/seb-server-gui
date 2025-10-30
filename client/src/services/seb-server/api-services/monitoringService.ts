import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { OptionalParGetMonitoringClientLogs } from "@/models/seb-server/optionalParamters";
import {
    ClientEventResponse,
    ClientNotification,
    MonitoringConnections,
    MonitoringOverview,
    MonitoringStaticClientData,
    SingleConnection,
} from "@/models/seb-server/monitoring";
import { Exam } from "@/models/seb-server/exam";
import { ClientInstruction } from "@/models/seb-server/clientInstruction";

const monitoringUrl: string = "/monitoring";
const clientEventUrl: string = "/seb-client-event";

export async function applyTestRun(id: string): Promise<Exam> {
    return (
        await apiService.api.post(
            monitoringUrl + "/testrun/" + id,
            {},
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}

export async function getOverview(examId: string): Promise<MonitoringOverview> {
    const response = await apiService.api.get(
        monitoringUrl + "/get-overview/" + examId,
        { headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN) },
    );
    return response.data;
}

export async function getConnections(
    examId: string,
    optionalHeaders: unknown,
): Promise<MonitoringConnections> {
    const url: string = monitoringUrl + "/connections/" + examId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalHeaders },
        })
    ).data;
}

export async function getSingleConnection(
    examId: string,
    connectionToken: string,
): Promise<SingleConnection> {
    const url: string = "/get-monitoring/" + examId + "/" + connectionToken;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getSingleConnectionEvents(
    clientConnectionId: string,
    optionalParameters?: OptionalParGetMonitoringClientLogs,
): Promise<ClientEventResponse | null> {
    const url: string = clientEventUrl + "/search" + "/" + clientConnectionId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function getStaticClientData(
    examId: string,
    modelIds: string,
): Promise<MonitoringStaticClientData> {
    const url: string = monitoringUrl + "/" + examId + "/static-client-data";
    return (
        await apiService.api.post(
            url,
            { modelIds },
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}

export async function registerInstruction(
    examId: string,
    clientInstruction: ClientInstruction,
): Promise<number> {
    const url: string = monitoringUrl + "/" + examId + "/instruction";
    const call = await apiService.api.post(url, clientInstruction, {headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN)});
    return call.status;
}

export async function getPendingNotifcations(
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[]> {
    const url: string =
        monitoringUrl + "/" + examId + "/notification/" + connectionToken;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function confirmNotification(
    examId: string,
    notificationId: string,
    connectionToken: string,
): Promise<unknown> {
    const url: string = monitoringUrl + "/" + examId + "/notification/" + notificationId + "/" + connectionToken;
    return (
        await apiService.api.post(url, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).status;
}

export async function disableConnections(
    examId: string,
    connectionToken: string,
): Promise<unknown> {
    const url: string = monitoringUrl + "/" + examId + "/disable-connection";
    return (
        await apiService.api.post(
            url,
            { connectionToken },
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).status;
}
