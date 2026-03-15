import * as clientGroupService from "@/services/seb-server/api-services/clientGroupService";
import { ClientGroup, ClientGroups } from "@/models/seb-server/clientGroup";

//= ============api==============
export async function createClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup | null> {
    try {
        return await clientGroupService.createClientGroup(clientGroup);
    } catch {
        return null;
    }
}

export async function updateClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup | null> {
    try {
        return await clientGroupService.updateClientGroup(clientGroup);
    } catch {
        return null;
    }
}

export async function deleteClientGroup(id: string): Promise<undefined | null> {
    try {
        return await clientGroupService.deleteClientGroup(id);
    } catch {
        return null;
    }
}

export async function getClientGroups(
    id?: string,
): Promise<ClientGroups | null> {
    try {
        return await clientGroupService.getClientGroups(id);
    } catch {
        return null;
    }
}
