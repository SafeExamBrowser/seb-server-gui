import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useAssessmentToolsTableActions(deps: {
    onTest: (item: TableItem) => void;
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "test",
            icon: "mdi-lan-check",
            label: t("assessmentToolConnections.test.action.title"),
            tooltip: t("assessmentToolConnections.test.action.title"),
            onClick: deps.onTest,
        },
        {
            key: "edit",
            icon: "mdi-pencil",
            label: t("general.editButton"),
            tooltip: t("general.editButton"),
            onClick: deps.onEdit,
        },
        {
            key: "delete",
            icon: "mdi-delete",
            label: t("general.deleteButton"),
            tooltip: t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
