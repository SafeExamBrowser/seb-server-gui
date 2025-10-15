import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";

export type ClientGroup = {
    name: string;
    id: number;
    type?:
        | ClientGroupEnum.IP_V4_RANGE
        | ClientGroupEnum.CLIENT_OS
        | ClientGroupEnum.NAME_ALPHABETICAL_RANGE
        | "SCREEN_PROCTORING_SINGLE"
        | "SCREEN_PROCTORING_FALLBACK";
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
