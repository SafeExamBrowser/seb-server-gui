import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";

const url: string = "/client-group";

export async function createClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup> {
    return (
        await apiService.api.post(url, clientGroup, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function updateClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup> {
    return (
        await apiService.api.put(url, clientGroup, {
            headers: apiService.getPostHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function deleteClientGroup(id: string): Promise<undefined | null> {
    return (
        await apiService.api.delete(url + "/" + id, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getClientGroup(id: string): Promise<ClientGroup> {
    return (
        await apiService.api.get(url + "/" + id, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
        })
    ).data;
}

export async function getClientGroups(id?: string): Promise<ClientGroups> {
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { id },
        })
    ).data;
}
