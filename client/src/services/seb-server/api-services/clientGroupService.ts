import * as newApiService from "@/services/newApiService";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";

const baseUrl = "/client-group";

export const getClientGroups = async (id?: string): Promise<ClientGroups> =>
    (await newApiService.getRequest(baseUrl, { params: { examId: id } })).data;

export const createClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (
        await newApiService.postRequest(baseUrl, clientGroup, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
    ).data;

export const updateClientGroup = async (
    clientGroup: ClientGroup,
): Promise<ClientGroup> =>
    (await newApiService.putRequest(baseUrl, clientGroup)).data;

export const deleteClientGroup = async (
    id: string,
): Promise<undefined | null> =>
    (await newApiService.deleteRequest(`${baseUrl}/${id}`)).data;
