import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { TableAction } from "@/components/widgets/entity-table/types.ts";
import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";

export function useExamTemplateTableActions(deps: {
    onEdit: (item: ExamTemplateTableItem) => void;
    onCopy: (item: ExamTemplateTableItem) => void;
    onDelete: (item: ExamTemplateTableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction<ExamTemplateTableItem>[]>(() => [
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
