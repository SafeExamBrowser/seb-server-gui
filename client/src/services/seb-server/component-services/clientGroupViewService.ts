import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";
import * as clientGroupService from "@/services/seb-server/api-services/clientGroupService";

//= ============api==============
export async function createClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup | null> {
    try {
        return await clientGroupService.createClientGroup(clientGroup);
    } catch (error) {
        return null;
    }
}

export async function getClientGroup(id: string): Promise<ClientGroup | null> {
    try {
        return await clientGroupService.getClientGroup(id);
    } catch (error) {
        return null;
    }
}

export async function updateClientGroup(
    clientGroup: ClientGroup,
): Promise<ClientGroup | null> {
    try {
        return await clientGroupService.updateClientGroup(clientGroup);
    } catch (error) {
        return null;
    }
}

export async function deleteClientGroup(id: string): Promise<any | null> {
    try {
        return await clientGroupService.deleteClientGroup(id);
    } catch (error) {
        return null;
    }
}

export async function getClientGroups(
    id?: string,
): Promise<ClientGroups | null> {
    try {
        return await clientGroupService.getClientGroups(id);
    } catch (error) {
        return null;
    }
}

//= =======create params========
export function getCreateClientGroupParams(
    examId: number,
    name: string,
    type: ClientGroupEnum,
    ipRangeStart?: string,
    ipRangeEnd?: string,
    clientOS?: ClientOSEnum | null,
    nameRangeStartLetter?: string,
    nameRangeEndLetter?: string,
): ClientGroup | null {
    if (type === ClientGroupEnum.CLIENT_OS) {
        if (clientOS == null) {
            return null;
        }

        return {
            examId,
            name,
            type: ClientGroupEnum.CLIENT_OS,
            clientOS,
        };
    }

    if (type === ClientGroupEnum.IP_V4_RANGE) {
        return {
            examId,
            name,
            type: ClientGroupEnum.IP_V4_RANGE,
            ipRangeStart,
            ipRangeEnd,
        };
    }

    if (type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE) {
        return {
            examId,
            name,
            type: ClientGroupEnum.NAME_ALPHABETICAL_RANGE,
            nameRangeStartLetter,
            nameRangeEndLetter,
        };
    }

    return null;
}
