import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum.ts";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";

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
