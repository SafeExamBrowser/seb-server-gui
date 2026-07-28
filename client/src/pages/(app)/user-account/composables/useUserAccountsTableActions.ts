import { computed } from "vue";

import { ROW_ACTION } from "@/components/widgets/entity-table/rowActions.ts";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";
import { isTeacherOnlyAccount } from "@/models/userAccount.ts";

export function useUserAccountsTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: ROW_ACTION.edit,
            icon: "mdi-pencil",
            label: i18n.global.t("general.editButton"),
            onClick: deps.onEdit,
            // Teacher accounts are auto-generated and cannot be edited: disable
            // the action and explain why on hover.
            disabled: (item) => isTeacherOnlyAccount(item.userRoles),
            tooltip: (item) =>
                isTeacherOnlyAccount(item.userRoles)
                    ? i18n.global.t("userAccount.teacherNotEditable.message")
                    : undefined,
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
