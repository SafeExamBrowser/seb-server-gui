import { ClientInstruction } from "@/models/seb-server/clientInstruction";
import { Exam, Exams } from "@/models/seb-server/exam";
import {
    ClientEventResponse,
    ClientNotification,
    MonitoringConnections,
    MonitoringOverview,
    MonitoringStaticClientData,
    SingleConnection,
} from "@/models/seb-server/monitoring";
import { MonitoringConnectionHeaders } from "@/models/seb-server/monitoring";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import { OptionalParGetMonitoringClientLogs } from "@/models/seb-server/optionalParamters";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import * as apiService from "@/services/apiService";

const baseUrl: string = "/monitoring";
const clientEventUrl: string = "/seb-client-event";

export const getExamsForMonitoring = async (
    optionalParameters?: OptionalParGetExams,
): Promise<Exams> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: {
                _authType: "seb",
                params: optionalParameters,
            },
        })
    ).data;

export const getExamsForAnalysis = async (
    optionalParameters?: OptionalParGetExams,
): Promise<Exams> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/finishedexams`,
            options: {
                _authType: "seb",
                params: optionalParameters,
            },
        })
    ).data;

export const getOverview = async (
    examId: string,
): Promise<MonitoringOverview> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/overview/${examId}`,
            options: { _authType: "seb" },
        })
    ).data;

export const getConnections = async (
    examId: string,
    additionalHeaders: MonitoringConnectionHeaders,
): Promise<MonitoringConnections> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/connections/${examId}`,
            options: {
                _authType: "seb",
                headers: {
                    "show-all":
                        additionalHeaders[MonitoringHeaderEnum.SHOW_ALL],
                    "show-client-groups":
                        additionalHeaders[
                            MonitoringHeaderEnum.SHOW_CLIENT_GROUPS
                        ],
                    "show-states":
                        additionalHeaders[MonitoringHeaderEnum.SHOW_STATES],
                    "show-notifications":
                        additionalHeaders[
                            MonitoringHeaderEnum.SHOW_NOTIFCATION
                        ],
                    "show-indicators":
                        additionalHeaders[MonitoringHeaderEnum.SHOW_INDICATORS],
                },
            },
        })
    ).data;

export async function applyTestRun(id: string): Promise<Exam> {
    return (
        await apiService.postRequest({
            url: `${baseUrl}/testrun/${id}`,
            options: { _authType: "seb" },
        })
    ).data;
}

export const getSingleConnection = async (
    examId: string,
    connectionToken: string,
): Promise<SingleConnection> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${examId}/${connectionToken}`,
            options: { _authType: "seb" },
        })
    ).data;

export const getSingleConnectionEvents = async (
    clientConnectionId: string,
    optionalParameters?: OptionalParGetMonitoringClientLogs,
): Promise<ClientEventResponse> =>
    (
        await apiService.getRequest({
            url: `${clientEventUrl}/search`,
            options: {
                _authType: "seb",
                params: {
                    ...optionalParameters,
                    clientConnectionId,
                },
            },
        })
    ).data;

export const downloadSEBLogsForExam = async (examId: string): Promise<Blob> =>
    (
        await apiService.getRequest({
            url: `${clientEventUrl}/export`,
            options: {
                _authType: "seb",
                params: {
                    examId: examId,
                    includeExamDetails: true,
                    exportType: "CSV",
                    includeConnectionDetails: true,
                },
                responseType: "blob",
                headers: {
                    accept: "application/octet-stream",
                },
            },
        })
    ).data;

export const getStaticClientData = async (
    examId: string,
    modelIds: string,
): Promise<MonitoringStaticClientData> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${examId}/static-client-data`,
            data: { modelIds },
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        })
    ).data;

export const registerInstruction = async (
    examId: string,
    clientInstruction: ClientInstruction,
): Promise<number> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest({
            url: `${baseUrl}/${examId}/instruction`,
            data: clientInstruction,
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).status;

// TODO @andreas: please test this as soon as quit all function is working again
export const quitAll = async (examId: string): Promise<number> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest({
            url: `${baseUrl}/${examId}/quitAll`,
            data: {},
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).status;

export const getPendingNotifications = async (
    examId: string,
    connectionToken: string,
): Promise<ClientNotification[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/${examId}/notification/${connectionToken}`,
            options: { _authType: "seb" },
        })
    ).data;

export const confirmNotification = async (
    examId: string,
    notificationId: string,
    connectionToken: string,
): Promise<unknown> =>
    // TODO @andreas: please check if this really needs "application/json"
    (
        await apiService.postRequest({
            url: `${baseUrl}/${examId}/notification/${notificationId}/${connectionToken}`,
            data: {},
            options: {
                _authType: "seb",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).status;

export const disableConnections = async (
    examId: string,
    connectionToken: string,
): Promise<unknown> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/${examId}/disable-connection`,
            data: { connectionToken },
            options: { _authType: "seb" },
        })
    ).status;
