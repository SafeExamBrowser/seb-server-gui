import {
    ClientGroupEnum,
    ClientOSEnum,
} from "@/models/seb-server/clientGroupEnum";

export type ClientGroupTransient = {
    id: number;
    name: string;
    isValid: boolean;
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

export const clientGroupTransientToClientGroup = (
    clientGroupTransient: ClientGroupTransient,
): ClientGroup => {
    const { isValid, ...clientGroup } = clientGroupTransient;

    if (isValid === false) {
        throw new Error("Client group transient is not a valid client group!");
    }

    // we trust the validation flag as this passed through the form validation rules
    // TODO @alain: consider using https://github.com/colinhacks/zod for this for more safety
    return clientGroup as ClientGroup;
};
