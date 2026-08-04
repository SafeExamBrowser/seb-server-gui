import i18n from "@/i18n";
import { ClientGroup as ExamClientGroup } from "@/models/seb-server/clientGroup.ts";
import {
    ClientGroupEnum,
    ClientOSLimited,
} from "@/models/seb-server/clientGroupEnum.ts";
import {
    ClientGroup,
    clientGroupSchema,
} from "@/models/seb-server/examTemplate.ts";

const CLIENT_OS_LABEL_I18N_KEYS: Record<ClientOSLimited, string> = {
    WINDOWS: "clientGroups.fields.clientOS.types.WINDOWS",
    MAC_OS: "clientGroups.fields.clientOS.types.MAC_OS",
    I_OS: "clientGroups.fields.clientOS.types.I_OS",
    IPAD_OS: "clientGroups.fields.clientOS.types.IPAD_OS",
    I_OS_OR_IPAD_OS: "clientGroups.fields.clientOS.types.I_OS_OR_IPAD_OS",
};

export const getClientGroupTypeDetails = (clientGroup: ClientGroup) => {
    switch (clientGroup.type) {
        case ClientGroupEnum.IP_V4_RANGE:
            return `${i18n.global.t(
                "clientGroups.fields.type.types.IP_V4_RANGE",
            )} (${clientGroup.ipRangeStart} – ${clientGroup.ipRangeEnd})`;
        case ClientGroupEnum.CLIENT_OS:
            return `${i18n.global.t(
                "clientGroups.fields.type.types.CLIENT_OS",
            )} (${i18n.global.t(
                CLIENT_OS_LABEL_I18N_KEYS[clientGroup.clientOS],
            )})`;
        case ClientGroupEnum.NAME_ALPHABETICAL_RANGE:
            return `${i18n.global.t(
                "clientGroups.fields.type.types.NAME_ALPHABETICAL_RANGE",
            )} (${clientGroup.nameRangeStartLetter} – ${clientGroup.nameRangeEndLetter})`;
        default:
            return clientGroup satisfies never;
    }
};

const TYPE_LABEL_I18N_KEYS: Partial<Record<string, string>> = {
    IP_V4_RANGE: "clientGroups.fields.type.types.IP_V4_RANGE",
    CLIENT_OS: "clientGroups.fields.type.types.CLIENT_OS",
    NAME_ALPHABETICAL_RANGE:
        "clientGroups.fields.type.types.NAME_ALPHABETICAL_RANGE",
};

const typeLabel = (type: string) => {
    const key = TYPE_LABEL_I18N_KEYS[type];

    if (key === undefined) {
        return type;
    }

    return i18n.global.t(key);
};

// This deals with the less strict version of the ClientGroup type.
// Hopefully we can clean up our types in the future and this hack will not be needed anymore.
export const getExamClientGroupTypeDetails = (group: ExamClientGroup) => {
    const parsed = clientGroupSchema.safeParse({
        ...group,
        // isSPSGroup is the exam wire name for screenProctoringEnabled
        screenProctoringEnabled: group.isSPSGroup ?? false,
    });

    if (!parsed.success) {
        return typeLabel(group.type);
    }

    return getClientGroupTypeDetails(parsed.data);
};
