import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";

export type ClientGroupTransient = {
    id: number;
    name: string;
    type?:
        | ClientGroupEnum.IP_V4_RANGE
        | ClientGroupEnum.CLIENT_OS
        | ClientGroupEnum.NAME_ALPHABETICAL_RANGE;
    ipRangeStart?: string;
    ipRangeEnd?: string;
    clientOS?: ClientOSEnum;
    nameRangeStartLetter?: string;
    nameRangeEndLetter?: string;
};

export type ClientGroup = {
    id: number;
    name: string;
} & (
    | {
          type: ClientGroupEnum.IP_V4_RANGE;
          ipRangeStart: string;
          ipRangeEnd: string;
      }
    | {
          type: ClientGroupEnum.CLIENT_OS;
          clientOS: ClientOSEnum;
      }
    | {
          type: ClientGroupEnum.NAME_ALPHABETICAL_RANGE;
          nameRangeStartLetter: string;
          nameRangeEndLetter: string;
      }
);

export type ClientGroupForTable =
    | ClientGroup
    | {
          type: "SCREEN_PROCTORING_SINGLE";
      }
    | {
          type: "SCREEN_PROCTORING_FALLBACK";
      };

// TODO @alain: consider using https://github.com/colinhacks/zod for this
export const isClientGroup = (
    group: ClientGroupTransient,
): group is ClientGroup => {
    if (group.type === undefined) {
        return false;
    }

    return true;

    // TODO @alain: uncomment this when the full ClientGroup form is implemented
    // switch (group.type) {
    //     case ClientGroupEnum.IP_V4_RANGE:
    //         return (
    //             group.ipRangeStart !== undefined &&
    //             group.ipRangeEnd !== undefined
    //         );
    //     case ClientGroupEnum.CLIENT_OS:
    //         return group.clientOS !== undefined;
    //     case ClientGroupEnum.NAME_ALPHABETICAL_RANGE:
    //         return (
    //             group.nameRangeStartLetter !== undefined &&
    //             group.nameRangeEndLetter !== undefined
    //         );
    //     case undefined:
    //     default:
    //         return false;
    // }
};
