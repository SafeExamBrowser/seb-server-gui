export type SummarySectionItem = {
    key: string;
} & (
    | {
          type: "basic";
          label: string;
          value: string | boolean;
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
