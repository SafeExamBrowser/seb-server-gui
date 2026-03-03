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
        await apiService.getRequest(baseUrl + "/names", {
            params: { active: "true" },
        })
    ).data;

export const getConnectionConfigurationsActive =
    async (): Promise<ConnectionConfigurations> =>
        (await apiService.getRequest(baseUrl + "/active")).data;

export const downloadExamConfig = async (
    examId: string,
    connectionId: string,
): Promise<Blob> =>
    (
        await apiService.getRequest(`${baseUrl}/download/${connectionId}`, {
            params: { examId },
            responseType: "blob",
            headers: {
                accept: "application/octet-stream",
            },
        })
    ).data;

export const getConnectionConfiguration = async (
    id: number,
): Promise<ConnectionConfiguration> =>
    (await apiService.getRequest(baseUrl + "/" + id)).data;

export const getConnectionConfigurations = async (
    optionalParameters?: OptionalParGetConnectionConfiguration,
): Promise<ConnectionConfigurations> =>
    (await apiService.getRequest(baseUrl, { params: optionalParameters })).data;

export const activateConnectionConfiguration = async (
    id: string,
): Promise<ConnectionConfiguration> =>
    (
        await apiService.postRequest(
            `${baseUrl}/${id}/active`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const deactivateConnectionConfiguration = async (
    id: string,
): Promise<ConnectionConfiguration> =>
    (
        await apiService.postRequest(
            `${baseUrl}/${id}/inactive`,
            {},
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        )
    ).data;

export const deleteConnectionConfiguration = async (
    id: string,
): Promise<undefined | null> =>
    (await apiService.deleteRequest(`${baseUrl}/${id}`)).data;

export const createConnectionConfiguration = async (
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (
        await apiService.postRequest(baseUrl, connectionConfigurationPar, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const editConnectionConfiguration = async (
    connectionConfiguration: UpdateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (await apiService.putRequest(baseUrl, connectionConfiguration)).data;
