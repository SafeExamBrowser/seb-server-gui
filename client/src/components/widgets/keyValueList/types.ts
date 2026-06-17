import { Threshold } from "@/models/seb-server/examTemplate";

export type KeyValueItemValue =
    | {
          type: "string";
          value: string;
      }
    | {
          type: "boolean";
          value: boolean;
      }
    | {
          type: "thresholds";
          value: Threshold[];
      }
    | {
          type: "password";
          value: string;
      };

export type KeyValueItem = {
    key: string;
} & (
    | {
          type: "basic";
          label: string;
          value: KeyValueItemValue;
      }
    | {
          type: "collection";
          items: (KeyValueItem & { type: "basic" })[];
      }
);
