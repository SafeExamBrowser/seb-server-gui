import * as apiService from "@/services/apiService";
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
        await apiService.getRequest(baseUrl, {
            params: optionalParameters,
        })
    ).data;

export const getOverview = async (
    examId: string,
): Promise<MonitoringOverview> =>
    (await apiService.getRequest(`${baseUrl}/overview/${examId}`)).data;

export const getConnections = async (
    examId: string,
    additionalHeaders: MonitoringConnectionHeaders,
): Promise<MonitoringConnections> =>
    (
        await apiService.getRequest(`${baseUrl}/connections/${examId}`, {
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
    return (await apiService.postRequest(`${baseUrl}/testrun/${id}`)).data;
}

export const getSingleConnection = async (
    examId: string,
    connectionToken: string,
): Promise<SingleConnection> =>
    (await apiService.getRequest(`${baseUrl}/${examId}/${connectionToken}`))
        .data;

export const getSingleConnectionEvents = async (
    clientConnectionId: string,
    optionalParameters?: OptionalParGetMonitoringClientLogs,
): Promise<ClientEventResponse> =>
    (
        await apiService.getRequest("/seb-client-event/search", {
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
        await apiService.postRequest(
            `${baseUrl}/${examId}/static-client-data`,
            { modelIds },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const registerInstruction = async (
    examId: string,
    clientInstruction: ClientInstruction,
): Promise<number> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest(
            `${baseUrl}/${examId}/instruction`,
            clientInstruction,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
    ).status;

// TODO @andreas: please test this as soon as quit all function is working again
export const quitAll = async (examId: string): Promise<number> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest(
            `${baseUrl}/${examId}/quitAll`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
    ).status;

export const getPendingNotifications = async (
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[]> =>
    (
        await apiService.getRequest(
            `${baseUrl}/${examId}/notification/${connectionToken}`,
        )
    ).data;

export const confirmNotification = async (
    examId: string,
    notificationId: string,
    connectionToken: string,
): Promise<unknown> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest(
            `${baseUrl}/${examId}/notification/${notificationId}/${connectionToken}`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
    ).status;

export const disableConnections = async (
    examId: string,
    connectionToken: string,
): Promise<unknown> =>
    (
        await apiService.postRequest(
            `${baseUrl}/${examId}/disable-connection`,
            { connectionToken },
        )
    ).status;
