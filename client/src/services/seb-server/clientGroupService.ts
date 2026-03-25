import * as apiService from "@/services/apiService";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";

const baseUrl = "/client-group" as const;

export const getClientGroups = async (id?: string): Promise<ClientGroups> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb", params: { examId: id } },
        })
    ).data;

export const createClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (
        await apiService.postRequest({
            url: baseUrl,
            data: clientGroup,
            options: { _authType: "seb" },
        })
    ).data;

export const updateClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (
        await apiService.putRequest({
            url: baseUrl,
            data: clientGroup,
            options: { _authType: "seb" },
        })
    ).data;

export const deleteClientGroup = async (
    id: string,
): Promise<undefined | null> =>
    (
        await apiService.deleteRequest({
            url: `${baseUrl}/${id}`,
            options: { _authType: "seb" },
        })
    ).data;
