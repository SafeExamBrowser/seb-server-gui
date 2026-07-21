import { Ref } from "vue";

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

// Synthetic, non-editable row representing the screen proctoring fallback group.
// Its id is a sentinel that cannot collide with real client group ids (which are
// non-negative)
export const SCREEN_PROCTORING_FALLBACK_ROW_ID = -1;

type ClientGroupFallback =
    | {
          id: typeof SCREEN_PROCTORING_FALLBACK_ROW_ID;
          name: string;
          type: "SCREEN_PROCTORING_SINGLE";
          screenProctoringEnabled: true;
      }
    | {
          id: typeof SCREEN_PROCTORING_FALLBACK_ROW_ID;
          name: string;
          type: "SCREEN_PROCTORING_FALLBACK";
          screenProctoringEnabled: true;
      };

export type ClientGroupForTable = ClientGroupExisting | ClientGroupFallback;

export const isFallbackGroup = (
    item: ClientGroupForTable,
): item is ClientGroupFallback =>
    item.type === "SCREEN_PROCTORING_FALLBACK" ||
    item.type === "SCREEN_PROCTORING_SINGLE";

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
        collectionStrategy: Ref<ScreenProctoringCollectionStrategy | undefined>;
        fallbackGroupName?: Ref<string | undefined>;
    };
    createItem: (item: ClientGroup) => Promise<void>;
    updateItem: (item: ClientGroupExisting) => Promise<void>;
    deleteItem: (item: ClientGroupExisting) => Promise<void>;
    confirmDelete?: boolean;
};
