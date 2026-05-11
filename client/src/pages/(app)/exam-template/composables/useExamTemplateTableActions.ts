import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useExamTemplateTableActions(deps: {
    onEdit: (item: TableItem) => void;
    onCopy: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "edit",
            icon: "mdi-pencil",
            label: t("general.editButton"),
            onClick: deps.onEdit,
        },
        {
            key: "copy",
            icon: "mdi-content-copy",
            label: t("general.copyButton"),
            onClick: deps.onCopy,
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
