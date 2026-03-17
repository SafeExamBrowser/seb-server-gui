import * as apiService from "@/services/apiService";

import {
    ConnectionConfiguration,
    ConnectionConfigurationName,
    ConnectionConfigurations,
    CreateConnectionConfigurationPar,
    OptionalParGetConnectionConfiguration,
    UpdateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration";

const baseUrl = "/client_configuration" as const;

export const getConnectionConfigurationNamesActive = async (): Promise<
    ConnectionConfigurationName[]
> =>
    (
        await apiService.getRequest({
            url: baseUrl + "/names",
            options: {
                params: { active: "true" },
            },
        })
    ).data;

export const getConnectionConfigurationsActive =
    async (): Promise<ConnectionConfigurations> =>
        (await apiService.getRequest({ url: baseUrl + "/active" })).data;

export const downloadExamConfig = async (
    examId: string,
    connectionId: string,
): Promise<Blob> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/download/${connectionId}`,
            options: {
                params: { examId },
                responseType: "blob",
                headers: {
                    accept: "application/octet-stream",
                },
            },
        })
    ).data;

export const getConnectionConfiguration = async (
    id: number,
): Promise<ConnectionConfiguration> =>
    (await apiService.getRequest({ url: baseUrl + "/" + id })).data;

export const getConnectionConfigurations = async (
    optionalParameters?: OptionalParGetConnectionConfiguration,
): Promise<ConnectionConfigurations> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { params: optionalParameters },
        })
    ).data;

export const activateConnectionConfiguration = async (
    id: string,
): Promise<ConnectionConfiguration> =>
    (await apiService.postRequest({ url: `${baseUrl}/${id}/active` })).data;

export const deactivateConnectionConfiguration = async (
    id: string,
): Promise<ConnectionConfiguration> =>
    (await apiService.postRequest({ url: `${baseUrl}/${id}/inactive` })).data;

export const deleteConnectionConfiguration = async (
    id: string,
): Promise<undefined | null> =>
    (await apiService.deleteRequest({ url: `${baseUrl}/${id}` })).data;

export const createConnectionConfiguration = async (
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: connectionConfigurationPar,
        })
    ).data;

export const editConnectionConfiguration = async (
    connectionConfiguration: UpdateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (
        await apiService.putRequest({
            url: baseUrl,
            data: connectionConfiguration,
        })
    ).data;
