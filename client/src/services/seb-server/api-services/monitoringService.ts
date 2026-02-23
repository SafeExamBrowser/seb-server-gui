import * as newApiService from "@/services/newApiService";
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
import { Exam, Exams } from "@/models/seb-server/exam";
import { ClientInstruction } from "@/models/seb-server/clientInstruction";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import { MonitoringConnectionHeaders } from "@/models/seb-server/monitoring";

const baseUrl: string = "/monitoring";
const clientEventUrl: string = "/seb-client-event";

export const getExamsForMonitoring = async (
    optionalParameters?: OptionalParGetExams,
): Promise<Exams> =>
    (
        await newApiService.getRequest(baseUrl, {
            params: optionalParameters,
        })
    ).data;

export const getOverview = async (
    examId: string,
): Promise<MonitoringOverview> =>
    (await newApiService.getRequest(`${baseUrl}/overview/${examId}`)).data;

export const getConnections = async (
    examId: string,
    additionalHeaders: MonitoringConnectionHeaders,
): Promise<MonitoringConnections> =>
    (
        await newApiService.getRequest(`${baseUrl}/connections/${examId}`, {
            headers: {
                "show-all": additionalHeaders[MonitoringHeaderEnum.SHOW_ALL],
                "show-client-groups":
                    additionalHeaders[MonitoringHeaderEnum.SHOW_CLIENT_GROUPS],
                "show-states":
                    additionalHeaders[MonitoringHeaderEnum.SHOW_STATES],
                "show-notifications":
                    additionalHeaders[MonitoringHeaderEnum.SHOW_NOTIFCATION],
                "show-indicators":
                    additionalHeaders[MonitoringHeaderEnum.SHOW_INDICATORS],
            },
        })
    ).data;

export async function applyTestRun(id: string): Promise<Exam> {
    return (
        await newApiService.postRequest(
            `${baseUrl}/testrun/${id}`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;
}

// TODO @andreas: please test this
export const getSingleConnection = async (
    examId: string,
    connectionToken: string,
): Promise<SingleConnection> =>
    (await newApiService.getRequest(`${baseUrl}/${examId}/${connectionToken}`))
        .data;

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
    const url: string = baseUrl + "/" + examId + "/static-client-data";
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
    const url: string = baseUrl + "/" + examId + "/instruction";
    const call = await apiService.api.post(url, clientInstruction, {
        headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
    });
    return call.status;
}

export async function quitAll(examId: string): Promise<number> {
    const url: string = baseUrl + "/" + examId + "/quitAll";
    const call = await apiService.api.post(
        url,
        {},
        {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        },
    );
    return call.status;
}

export async function getPendingNotifcations(
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[]> {
    const url: string =
        baseUrl + "/" + examId + "/notification/" + connectionToken;
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
    const url: string =
        baseUrl +
        "/" +
        examId +
        "/notification/" +
        notificationId +
        "/" +
        connectionToken;
    return (
        await apiService.api.post(
            url,
            {},
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).status;
}

export async function disableConnections(
    examId: string,
    connectionToken: string,
): Promise<unknown> {
    const url: string = baseUrl + "/" + examId + "/disable-connection";
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
