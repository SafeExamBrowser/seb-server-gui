import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useArchiveTableActions(deps: {
    onArchiveExam: (item: TableItem) => void;
    canArchiveExam: (item: TableItem) => boolean;
    onNavigate: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "archiveExam",
            icon: "mdi-archive",
            label: t("examList.actions.archive"),
            tooltip: t("examList.actions.archive"),
            onClick: deps.onArchiveExam,
            visible: deps.canArchiveExam,
        },
        // NOTE: once we need jump to Exam Detail, uncomment this
        // {
        //     key: "navigate",
        //     icon: "mdi-chevron-right",
        //     label: t("general.viewButton"),
        //     onClick: deps.onNavigate,
        // },
    ]);
}
