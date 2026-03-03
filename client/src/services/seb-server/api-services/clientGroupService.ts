import * as apiService from "@/services/apiService";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";

const baseUrl = "/client-group" as const;

export const getClientGroups = async (id?: string): Promise<ClientGroups> =>
    (await apiService.getRequest(baseUrl, { params: { examId: id } })).data;

export const createClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (
        await apiService.postRequest(baseUrl, clientGroup, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
    ).data;

export const updateClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (await apiService.putRequest(baseUrl, clientGroup)).data;

export const deleteClientGroup = async (
    id: string,
): Promise<undefined | null> =>
    (await apiService.deleteRequest(`${baseUrl}/${id}`)).data;
