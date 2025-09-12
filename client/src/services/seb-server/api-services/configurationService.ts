import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const connectionConfigurationUrl = "/client_configuration";
const downloadExamConfigUrl = "/client_configuration/download";

export async function getConnectionConfigurationsActive(
    isActive: string,
): Promise<any> {
    const url: string = connectionConfigurationUrl + "/active";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { isActive },
        })
    ).data;
}

export async function downloadExamConfig(
    examId: string,
    connectionId: string,
): Promise<ConnectionConfigurations | any> {
    const url: string = downloadExamConfigUrl + "/" + connectionId;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { examId },
            responseType: "blob",
        })
    ).data;
}

export async function getConnectionConfiguration(
    id: number,
): Promise<ConnectionConfiguration | any> {
    const url: string = connectionConfigurationUrl + "/" + id;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getConnectionConfigurations(
    optionalParameters?: OptionalParGetConnectionConfiguration,
): Promise<ConnectionConfigurations | any> {
    const url: string = connectionConfigurationUrl;
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}

export async function activateConnectionConfiguration(
    id: string,
): Promise<ConnectionConfiguration | any> {
    const url: string = connectionConfigurationUrl + "/" + id + "/active";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function deactivateConnectionConfiguration(
    id: string,
): Promise<ConnectionConfiguration | any> {
    const url: string = connectionConfigurationUrl + "/" + id + "/inactive";
    return (
        await apiService.api.post(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function deleteConnectionConfiguration(
    id: string,
): Promise<any | any> {
    return (
        await apiService.api.delete(connectionConfigurationUrl + "/" + id, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function createConnectionConfiguration(
    connectionConfigurationPar: CreateConnectionConfigurationPar,
): Promise<any | any> {
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
): Promise<ConnectionConfiguration | any> {
    return (
        await apiService.api.put(
            connectionConfigurationUrl,
            connectionConfiguration,
            { headers: apiService.getPutHeaders(StorageItemEnum.ACCESS_TOKEN) },
        )
    ).data;
}
