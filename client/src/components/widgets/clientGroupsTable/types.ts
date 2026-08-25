import { Ref } from "vue";

import { CrudTableAccess } from "@/components/widgets/crudTable/types.ts";
import {
    ClientGroupEnum,
    ClientOSLimited,
} from "@/models/seb-server/clientGroupEnum.ts";
import {
    ClientGroup,
    ClientGroupExisting,
    clientGroupExistingSchema,
    clientGroupSchema,
} from "@/models/seb-server/examTemplate.ts";
import { ScreenProctoringCollectionStrategy } from "@/models/seb-server/screenProctoring.ts";
import {
    ClientGroupFallback,
    FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS,
} from "@/utils/clientGroup.ts";

export type ClientGroupTransient = {
    id?: number; // absent for new groups; present (real id) only when editing
    name?: string;
    screenProctoringEnabled: boolean;
    type?:
        | ClientGroupEnum.IP_V4_RANGE
        | ClientGroupEnum.CLIENT_OS
        | ClientGroupEnum.NAME_ALPHABETICAL_RANGE;
    ipRangeStart?: string;
    ipRangeEnd?: string;
    clientOS?: ClientOSLimited;
    nameRangeStartLetter?: string;
    nameRangeEndLetter?: string;
};

export type ClientGroupForTable = ClientGroupExisting | ClientGroupFallback;

export const isFallbackGroup = (
    item: ClientGroupForTable,
): item is ClientGroupFallback =>
    item.type === "SCREEN_PROCTORING_FALLBACK" ||
    item.type === "SCREEN_PROCTORING_SINGLE";

export const TYPE_LABEL_I18N_KEYS: Record<ClientGroupForTable["type"], string> =
    {
        IP_V4_RANGE: "clientGroups.fields.type.types.IP_V4_RANGE",
        CLIENT_OS: "clientGroups.fields.type.types.CLIENT_OS",
        NAME_ALPHABETICAL_RANGE:
            "clientGroups.fields.type.types.NAME_ALPHABETICAL_RANGE",
        ...FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS,
    };

// zod.parse does two things in both converters below:
// 1. validate the schema (throws if the transient is not a valid client group;
//    should never happen given form validation, but catches form-validation gaps)
// 2. strip superfluous properties (e.g. remove `clientOS` if `type` is not CLIENT_OS)
export const clientGroupTransientToClientGroup = (
    clientGroupTransient: ClientGroupTransient,
): ClientGroup => clientGroupSchema.parse(clientGroupTransient);

export const clientGroupTransientToClientGroupExisting = (
    clientGroupTransient: ClientGroupTransient,
): ClientGroupExisting => clientGroupExistingSchema.parse(clientGroupTransient);

export type ClientGroupsTableDeps = {
    clientGroups: Ref<ClientGroupExisting[]>;
    screenProctoring: {
        enabled: Ref<boolean>;
        collectionStrategy: Ref<ScreenProctoringCollectionStrategy>;
        fallbackGroupName?: Ref<string | undefined>;
    };
    access?: CrudTableAccess;
    createItem: (item: ClientGroup) => Promise<void>;
    updateItem: (item: ClientGroupExisting) => Promise<void>;
    deleteItem: (item: ClientGroupExisting) => Promise<void>;
    confirmDelete?: boolean;
};
