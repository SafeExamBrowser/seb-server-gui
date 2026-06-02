import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import { Exam } from "@/models/seb-server/exam";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";

export function useArchiveTableActions(deps: {
    onArchiveExam: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "archiveExam",
            icon: "mdi-archive",
            label: t("examList.actions.archive"),
            tooltip: t("examList.actions.archive"),
            onClick: deps.onArchiveExam,
            visible: canArchive,
        },
    ]);
}

function canArchive(item: TableItem): boolean {
    const exam: Exam = item as Exam;
    return exam.status !== ExamStatusEnum.ARCHIVED;
}
