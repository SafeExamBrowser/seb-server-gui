import { computed } from "vue";
import type {
    TableAction,
    TableItem,
} from "@/components/blocks/entity-table/types.ts";

export function useMonitoringTableActions(deps: {
    onNavigate: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            labelKey: "general.viewButton",
            onClick: deps.onNavigate,
        },
    ]);
}
