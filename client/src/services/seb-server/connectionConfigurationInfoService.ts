import * as apiService from "@/services/apiService";

import {
    ConnectionConfigurationName,
    ConnectionConfigurations,
} from "@/models/seb-server/connectionConfiguration";

const baseUrl = "/client_configuration" as const;

export const getConnectionConfigurationNamesActive = async (): Promise<
    ConnectionConfigurationName[]
> =>
    (
        await apiService.getRequest({
            url: baseUrl + "/names",
            options: {
                _authType: "seb",
                params: { active: "true" },
            },
        })
    ).data;

export const getConnectionConfigurationsActive =
    async (): Promise<ConnectionConfigurations> =>
        (
            await apiService.getRequest({
                url: baseUrl + "/active",
                options: { _authType: "seb" },
            })
        ).data;

export const downloadExamConfig = async (
    examId: string,
    connectionId: string,
): Promise<Blob> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/download/${connectionId}`,
            options: {
                _authType: "seb",
                params: { id: examId },
                responseType: "blob",
                headers: {
                    accept: "application/octet-stream",
                },
            },
        })
    ).data;
