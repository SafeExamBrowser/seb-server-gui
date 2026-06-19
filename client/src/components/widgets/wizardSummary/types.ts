import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";

// The summary rows are plain key-value items. Kept as an alias so the existing
// getSummary*.ts helpers can keep importing SummarySectionItem.
export type SummarySectionItem = KeyValueItem;

export type SummarySectionData = {
    label: string;
    items: KeyValueItem[];
};
