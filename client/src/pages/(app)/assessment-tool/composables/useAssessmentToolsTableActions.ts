import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useAssessmentToolsTableActions(deps: {
    onTest: (item: TableItem) => void;
    onEdit: (item: TableItem) => void;
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "test",
            icon: "mdi-lan-check",
            label: i18n.global.t("assessmentToolConnections.test.action.title"),
            tooltip: i18n.global.t(
                "assessmentToolConnections.test.action.title",
            ),
            onClick: deps.onTest,
        },
        {
            key: "edit",
            icon: "mdi-pencil",
            label: i18n.global.t("general.editButton"),
            tooltip: i18n.global.t("general.editButton"),
            onClick: deps.onEdit,
        },
        {
            key: "delete",
            icon: "mdi-delete",
            label: i18n.global.t("general.deleteButton"),
            tooltip: i18n.global.t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
