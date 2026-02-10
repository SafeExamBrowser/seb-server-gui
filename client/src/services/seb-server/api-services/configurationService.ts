import * as newApiService from "@/services/newApiService";

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
        await newApiService.getRequest(baseUrl + "/names", {
            params: { active: "true" },
        })
    ).data;

export const getConnectionConfigurationsActive =
    async (): Promise<ConnectionConfigurations> =>
        (await newApiService.getRequest(baseUrl + "/active")).data;

export const downloadExamConfig = async (
    examId: string,
    connectionId: string,
): Promise<Blob> =>
    (
        await newApiService.getRequest(`${baseUrl}/download/${connectionId}`, {
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
    (await newApiService.getRequest(baseUrl + "/" + id)).data;

export const getConnectionConfigurations = async (
    optionalParameters?: OptionalParGetConnectionConfiguration,
): Promise<ConnectionConfigurations> =>
    (await newApiService.getRequest(baseUrl, { params: optionalParameters }))
        .data;

export const activateConnectionConfiguration = async (
    id: string,
): Promise<ConnectionConfiguration> =>
    (
        await newApiService.postRequest(
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
        await newApiService.postRequest(
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
    (await newApiService.deleteRequest(`${baseUrl}/${id}`)).data;

export const createConnectionConfiguration = async (
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (
        await newApiService.postRequest(baseUrl, connectionConfigurationPar, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
    ).data;

export const editConnectionConfiguration = async (
    connectionConfiguration: UpdateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> =>
    (await newApiService.putRequest(baseUrl, connectionConfiguration)).data;
