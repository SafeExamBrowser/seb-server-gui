import { z } from "zod";
import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";

export const clientOSLimitedValues = [
    ClientOSEnum.WINDOWS,
    ClientOSEnum.MAC_OS,
    ClientOSEnum.I_OS,
    ClientOSEnum.IPAD_OS,
    ClientOSEnum.I_OS_OR_IPAD_OS,
] as const;

type ClientOSLimited = (typeof clientOSLimitedValues)[number];

export type ClientGroupTransient = {
    id: number;
    name: string;
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

const clientGroupSchemaBase = z.object({
    id: z.number(),
    name: z.string(),
    screenProctoringEnabled: z.boolean(),
});

const clientGroupSchema = z.discriminatedUnion("type", [
    clientGroupSchemaBase.extend({
        type: z.literal(ClientGroupEnum.IP_V4_RANGE),
        ipRangeStart: z.string(),
        ipRangeEnd: z.string(),
    }),
    clientGroupSchemaBase.extend({
        type: z.literal(ClientGroupEnum.CLIENT_OS),
        clientOS: z.enum(clientOSLimitedValues),
    }),
    clientGroupSchemaBase.extend({
        type: z.literal(ClientGroupEnum.NAME_ALPHABETICAL_RANGE),
        nameRangeStartLetter: z.string(),
        nameRangeEndLetter: z.string(),
    }),
]);

export type ClientGroup = z.infer<typeof clientGroupSchema>;

export type ClientGroupForTable =
    | ClientGroup
    | {
          type: "SCREEN_PROCTORING_SINGLE";
          screenProctoringEnabled: true;
      }
    | {
          type: "SCREEN_PROCTORING_FALLBACK";
          screenProctoringEnabled: true;
      };

export const clientGroupTransientToClientGroup = (
    clientGroupTransient: ClientGroupTransient,
): ClientGroup => {
    // zod.parse does two things here:
    // 1. validate the schema:
    //    - throws an error if clientGroupTransient is not a valid clientGroup
    //    - this should never happen in practice, because of the form validation
    //    - this will catch errors in the form validation
    // 2. strip superfluous properties:
    //    - e.g. remove `clientOS` if `type` is not `ClientGroupEnum.CLIENT_OS`
    return clientGroupSchema.parse(clientGroupTransient);
};
