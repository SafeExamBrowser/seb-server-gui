import * as newApiService from "@/services/newApiService";

import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import {
    ConnectionConfiguration,
    ConnectionConfigurationName,
    ConnectionConfigurations,
    CreateConnectionConfigurationPar,
    OptionalParGetConnectionConfiguration,
    UpdateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration";

const baseUrl = "/client_configuration" as const;

const connectionConfigurationUrl = "/client_configuration";

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

export async function deleteConnectionConfiguration(
    id: string,
): Promise<undefined | null> {
    return (
        await apiService.api.delete(connectionConfigurationUrl + "/" + id, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createConnectionConfiguration(
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> {
    return (
        await apiService.api.post(
            connectionConfigurationUrl,
            connectionConfigurationPar,
            {
                headers: apiService.getPostHeaders(
                    StorageItemEnum.ACCESS_TOKEN,
                ),
            },
        )
    ).data;
}

export async function editConnectionConfiguration(
    connectionConfiguration: UpdateConnectionConfigurationPar,
): Promise<ConnectionConfiguration> {
    return (
        await apiService.api.put(
            connectionConfigurationUrl,
            connectionConfiguration,
            { headers: apiService.getPutHeaders(StorageItemEnum.ACCESS_TOKEN) },
        )
    ).data;
}
