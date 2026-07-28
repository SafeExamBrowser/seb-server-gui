import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";
import {
    type ExamTemplateTableItem,
    isExamTemplateTableItem,
} from "@/pages/(app)/exam-template/types.ts";

export function useExamTemplateTableActions(deps: {
    onEdit: (item: ExamTemplateTableItem) => void;
    onCopy: (item: ExamTemplateTableItem) => void;
    onDelete: (item: ExamTemplateTableItem) => void;
}) {
    // TODO @andrei: this type guard can be removed, once the EntityTable uses a generic type for the item
    const guardAction =
        (handler: (item: ExamTemplateTableItem) => void) =>
        (item: TableItem) => {
            if (!isExamTemplateTableItem(item)) {
                throw new Error("Invalid ExamTemplateTableItem!");
            }

            handler(item);
        };

    return computed<TableAction[]>(() => [
        {
            key: "edit",
            icon: "mdi-pencil",
            label: i18n.global.t("general.editButton"),
            onClick: guardAction(deps.onEdit),
        },
        {
            key: "copy",
            icon: "mdi-content-copy",
            label: i18n.global.t("general.copyButton"),
            onClick: guardAction(deps.onCopy),
        },
        {
            key: "delete",
            icon: "mdi-delete",
            label: i18n.global.t("general.deleteButton"),
            color: "error",
            onClick: guardAction(deps.onDelete),
        },
    ]);
}
