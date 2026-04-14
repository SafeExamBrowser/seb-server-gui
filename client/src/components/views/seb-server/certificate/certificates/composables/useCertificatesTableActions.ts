import { computed } from "vue";
import type {
    TableAction,
    TableItem,
} from "@/components/blocks/entity-table/types.ts";

export function useCertificatesTableActions(deps: {
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "delete",
            icon: "mdi-delete",
            labelKey: "general.delete",
            onClick: deps.onDelete,
        },
    ]);
}
