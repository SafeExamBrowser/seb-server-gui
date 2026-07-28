import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useArchiveTableActions(deps: {
    onArchiveExam: (item: TableItem) => void;
    canArchiveExam: (item: TableItem) => boolean;
    onNavigate: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "archiveExam",
            icon: "mdi-archive",
            label: i18n.global.t("examList.actions.archive"),
            tooltip: i18n.global.t("examList.actions.archive"),
            onClick: deps.onArchiveExam,
            visible: deps.canArchiveExam,
        },
        // NOTE: once we need jump to Exam Detail, uncomment this
        // {
        //     key: "navigate",
        //     icon: "mdi-chevron-right",
        //     label: i18n.global.t("general.viewButton"),
        //     onClick: deps.onNavigate,
        // },
    ]);
}
