import { computed } from "vue";

import { ROW_ACTION } from "@/components/widgets/entity-table/rowActions.ts";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useInstitutionsTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: ROW_ACTION.edit,
            icon: "mdi-pencil",
            label: i18n.global.t("general.editButton"),
            onClick: deps.onEdit,
        },
        {
            key: ROW_ACTION.delete,
            icon: "mdi-delete",
            label: i18n.global.t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
