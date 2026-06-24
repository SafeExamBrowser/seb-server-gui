import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { ROW_ACTION } from "@/components/widgets/entity-table/rowActions.ts";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useUserAccountsTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: ROW_ACTION.edit,
            icon: "mdi-pencil",
            label: t("general.editButton"),
            onClick: deps.onEdit,
        },
        {
            key: ROW_ACTION.delete,
            icon: "mdi-delete",
            label: t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
