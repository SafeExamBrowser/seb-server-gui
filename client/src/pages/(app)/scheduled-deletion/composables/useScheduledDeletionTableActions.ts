import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import {
    isScheduledDeleteItem,
    ScheduledDeleteItem,
} from "@/models/seb-server/sheduled-deletion";

export function useScheduledDeletionTableActions(deps: {
    onNavigate: (item: ScheduledDeleteItem) => void;
    onDelete: (item: ScheduledDeleteItem) => void;
}) {
    const { t } = useI18n();

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
            label: t("general.deleteButton"),
            color: "error",
            onClick: guardAction(deps.onDelete),
        },
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            label: t("general.viewButton"),
            onClick: guardAction(deps.onNavigate),
        },
    ]);
}
