import { computed } from "vue";
import type {
    TableAction,
    TableItem,
} from "@/components/blocks/entity-table/types.ts";

export function useExamTableActions(deps: {
    onNavigate: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            labelKey: "general.view",
            onClick: deps.onNavigate,
        },
    ]);
}
