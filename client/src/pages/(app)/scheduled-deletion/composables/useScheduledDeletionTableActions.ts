import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";
import {
    isScheduledDeleteItem,
    ScheduledDeleteItem,
} from "@/models/seb-server/scheduled-deletion";

export function useScheduledDeletionTableActions(deps: {
    onNavigate: (item: ScheduledDeleteItem) => void;
    canDelete: (item: TableItem) => boolean;
    onDelete: (item: ScheduledDeleteItem) => void;
}) {
    // TODO @andrei: this type guard can be removed, once the EntityTable uses a generic type for the item
    const guardAction =
        (handler: (item: ScheduledDeleteItem) => void) => (item: TableItem) => {
            if (!isScheduledDeleteItem(item)) {
                throw new Error("Invalid ExamTemplateTableItem!");
            }

            handler(item);
        };

    return computed<TableAction[]>(() => [
        {
            key: "delete",
            icon: "mdi-delete",
            label: i18n.global.t("general.deleteButton"),
            tooltip: i18n.global.t("scheduledDelete.actions.delete.tooltip"),
            color: "error",
            visible: deps.canDelete,
            onClick: guardAction(deps.onDelete),
        },
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            label: i18n.global.t("general.viewButton"),
            onClick: guardAction(deps.onNavigate),
        },
    ]);
}
