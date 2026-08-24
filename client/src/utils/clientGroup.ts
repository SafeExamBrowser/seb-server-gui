import i18n from "@/i18n";
import { ExamAttribute } from "@/models/examTemplate.ts";
import { ClientGroup as ExamClientGroup } from "@/models/seb-server/clientGroup.ts";
import {
    ClientGroupEnum,
    ClientOSLimited,
} from "@/models/seb-server/clientGroupEnum.ts";
import {
    ClientGroup,
    clientGroupSchema,
} from "@/models/seb-server/examTemplate.ts";
import {
    SCREEN_PROCTORING_COLLECTION_STRATEGY,
    ScreenProctoringCollectionStrategy,
} from "@/models/seb-server/screenProctoring.ts";

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

// Synthetic, display-only row representing the screen proctoring fallback group.
// Its id is a sentinel that cannot collide with real client group ids (which are
// non-negative)
export const SCREEN_PROCTORING_FALLBACK_ROW_ID = -1;

export type ClientGroupFallback = {
    id: typeof SCREEN_PROCTORING_FALLBACK_ROW_ID;
    name: string;
    type: "SCREEN_PROCTORING_SINGLE" | "SCREEN_PROCTORING_FALLBACK";
    screenProctoringEnabled: true;
};

export const FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS: Record<
    ClientGroupFallback["type"],
    string
> = {
    SCREEN_PROCTORING_SINGLE:
        "clientGroups.fields.type.types.SCREEN_PROCTORING_SINGLE",
    SCREEN_PROCTORING_FALLBACK:
        "clientGroups.fields.type.types.SCREEN_PROCTORING_FALLBACK",
};

export const getScreenProctoringFallbackGroup = (screenProctoring: {
    enabled: boolean;
    collectingStrategy?: ScreenProctoringCollectionStrategy;
    collectingGroupName?: string;
}): ClientGroupFallback | undefined => {
    if (!screenProctoring.enabled) {
        return undefined;
    }

    // the legacy "one group for exam" strategy
    if (screenProctoring.collectingStrategy === "EXAM") {
        return {
            id: SCREEN_PROCTORING_FALLBACK_ROW_ID,
            type: "SCREEN_PROCTORING_SINGLE",
            screenProctoringEnabled: true,
            name:
                screenProctoring.collectingGroupName ||
                i18n.global.t("clientGroups.screenProctoringSingleGroupName"),
        };
    }

    return {
        id: SCREEN_PROCTORING_FALLBACK_ROW_ID,
        type: "SCREEN_PROCTORING_FALLBACK",
        screenProctoringEnabled: true,
        name:
            screenProctoring.collectingGroupName ||
            i18n.global.t("clientGroups.screenProctoringFallbackGroupName"),
    };
};

export const getScreenProctoringFallbackGroupForTemplate = (
    attributes?: ExamAttribute,
) => {
    if (attributes === undefined) {
        return undefined;
    }

    return getScreenProctoringFallbackGroup({
        enabled: attributes.enableScreenProctoring === "true",
        collectingStrategy: SCREEN_PROCTORING_COLLECTION_STRATEGY.find(
            (strategy) => strategy === attributes.spsCollectingStrategy,
        ),
        collectingGroupName: attributes.spsCollectingGroupName,
    });
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
