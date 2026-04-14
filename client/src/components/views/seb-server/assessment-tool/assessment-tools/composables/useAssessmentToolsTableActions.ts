import { computed } from "vue";
import type {
    TableAction,
    TableItem,
} from "@/components/blocks/entity-table/types.ts";

export function useAssessmentToolsTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "edit",
            icon: "mdi-pencil",
            labelKey: "general.edit",
            onClick: deps.onEdit,
        },
        {
            key: "delete",
            icon: "mdi-delete",
            labelKey: "general.delete",
            onClick: deps.onDelete,
        },
    ]);
}
