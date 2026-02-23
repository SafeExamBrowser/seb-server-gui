import * as newApiService from "@/services/newApiService";
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

// TODO @andreas: please test this
export const getSingleConnectionEvents = async (
    clientConnectionId: string,
    optionalParameters?: OptionalParGetMonitoringClientLogs,
): Promise<ClientEventResponse> =>
    (
        await newApiService.getRequest("/seb-client-event/search", {
            params: {
                ...optionalParameters,
                clientConnectionId,
            },
        })
    ).data;

export const getStaticClientData = async (
    examId: string,
    modelIds: string,
): Promise<MonitoringStaticClientData> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${examId}/static-client-data`,
            { modelIds },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

// TODO @andreas: please test this
export const registerInstruction = async (
    examId: string,
    clientInstruction: ClientInstruction,
): Promise<number> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${examId}/instruction`,
            clientInstruction,
        )
    ).status;

// TODO @andreas: please test this
export const quitAll = async (examId: string): Promise<number> =>
    (await newApiService.postRequest(`${baseUrl}/${examId}/quitAll`)).status;

// TODO @andreas: please test this
export const getPendingNotifcations = async (
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[]> =>
    (
        await newApiService.getRequest(
            `${baseUrl}/${examId}/notification/${connectionToken}`,
        )
    ).data;

// TODO @andreas: please test this
export const confirmNotification = async (
    examId: string,
    notificationId: string,
    connectionToken: string,
): Promise<unknown> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${examId}/notification/${notificationId}/${connectionToken}`,
        )
    ).status;

// TODO @andreas: please test this
export const disableConnections = async (
    examId: string,
    connectionToken: string,
): Promise<unknown> =>
    (
        await newApiService.postRequest(
            `${baseUrl}/${examId}/disable-connection`,
            { connectionToken },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).status;
