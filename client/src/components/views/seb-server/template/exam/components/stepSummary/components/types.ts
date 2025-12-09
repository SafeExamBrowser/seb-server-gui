import { Threshold } from "@/models/seb-server/examTemplate";

type SummarySectionValueType =
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
      };

export type SummarySectionItem = {
    key: string;
} & (
    | {
          type: "basic";
          label: string;
          value: SummarySectionValueType;
      }
    | {
          type: "collection";
          items: (SummarySectionItem & { type: "basic" })[];
      }
);

export type SummarySectionData = {
    label: string;
    items: SummarySectionItem[];
};
