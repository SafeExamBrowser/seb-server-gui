import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";

// Copying a template's client group onto an exam creates a detached group:
// only name, type and the type-specific criteria are carried over (no color
// or icon).
export const templateGroupToClientGroup = (
    examId: number,
    templateGroup: ClientGroupExisting,
): ClientGroup => {
    const base = {
        examId,
        name: templateGroup.name,
        type: templateGroup.type,
        // TODO @alain: hardcoded false — the backend ignored true on create.
        // Whether the template's SP flag should be copied is an open question
        // with Andreas.
        isSPSGroup: false,
    };

    if (templateGroup.type === ClientGroupEnum.IP_V4_RANGE) {
        return {
            ...base,
            ipRangeStart: templateGroup.ipRangeStart,
            ipRangeEnd: templateGroup.ipRangeEnd,
        };
    }

    if (templateGroup.type === ClientGroupEnum.CLIENT_OS) {
        return {
            ...base,
            clientOS: templateGroup.clientOS,
        };
    }

    return {
        ...base,
        nameRangeStartLetter: templateGroup.nameRangeStartLetter,
        nameRangeEndLetter: templateGroup.nameRangeEndLetter,
    };
};
