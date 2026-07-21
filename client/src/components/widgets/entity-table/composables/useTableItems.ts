import { type MaybeRefOrGetter, toValue } from "vue";

import type {
    CellFormatter,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useTableItems(
    cellFormatters: MaybeRefOrGetter<Record<string, CellFormatter> | undefined>,
) {
    function getRawItem(item: unknown): TableItem {
        if (
            item &&
            typeof item === "object" &&
            "raw" in item &&
            item.raw &&
            typeof item.raw === "object"
        ) {
            return item.raw as TableItem;
        }

        return item as TableItem;
    }

    function formatCell(key: string, item: TableItem): string {
        const formatter = toValue(cellFormatters)?.[key];

        if (formatter) return formatter(item[key], item);

        const value = item[key];

        if (value === null || value === undefined) return "";

        return String(value);
    }

    return { getRawItem, formatCell };
}
