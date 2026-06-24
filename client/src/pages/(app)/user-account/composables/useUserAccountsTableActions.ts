import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import { isTeacherOnlyAccount } from "@/models/userAccount.ts";

export function useUserAccountsTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "edit",
            icon: "mdi-pencil",
            label: t("general.editButton"),
            onClick: deps.onEdit,
            // Teacher accounts are auto-generated and cannot be edited: disable
            // the action and explain why on hover.
            disabled: (item) => isTeacherOnlyAccount(item.userRoles),
            tooltip: (item) =>
                isTeacherOnlyAccount(item.userRoles)
                    ? t("userAccount.teacherNotEditable.message")
                    : undefined,
        },
        {
            key: "delete",
            icon: "mdi-delete",
            label: t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
