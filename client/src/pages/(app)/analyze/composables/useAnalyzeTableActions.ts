import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import { Exam } from "@/models/seb-server/exam";
import { downloadSEBLogsForExam } from "@/services/seb-server/monitoringService";
import { downloadBlob } from "@/utils/downloadUtils.ts";
import { stringToBoolean } from "@/utils/generalUtils";
import * as timeUtils from "@/utils/timeUtils.ts";

export function useAnalyzeTableActions(deps: {
    onShowSPS: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "showScreenProctoring",
            icon: "mdi-monitor-eye",
            label: t("examList.actions.showSPS"),
            tooltip: t("examList.actions.showSPS"),
            bgcolor: "primary",
            color: "grey",
            onClick: deps.onShowSPS,
            visible: spsEnabled,
        },
        {
            key: "downloadSEBLogs",
            icon: "mdi-download",
            label: t("examList.actions.downloadSEBLogs"),
            tooltip: t("examList.actions.downloadSEBLogs"),
            onClick: downloadSEBLogs,
        },
    ]);
}

async function downloadSEBLogs(item: TableItem) {
    if (item.id != null) {
        const blobResponse = await downloadSEBLogsForExam(String(item.id));

        if (blobResponse == null) {
            return;
        }

        downloadBlob(blobResponse, getExamConfigFileName(item));
    }
}

function getExamConfigFileName(item: TableItem): string {
    if (!item.quizName) {
        return `SEBClientLogs_${timeUtils.getCurrentDateString()}.csv`;
    }

    const examName = String(item.quizName).replaceAll(" ", "_");

    return `SEBClientLogs_${examName}_${timeUtils.getCurrentDateString()}.csv`;
}

function spsEnabled(item: TableItem): boolean {
    const exam: Exam = item as Exam;
    if (
        !exam.additionalAttributes ||
        !exam.additionalAttributes.enableScreenProctoring
    )
        return false;

    return stringToBoolean(exam.additionalAttributes.enableScreenProctoring);
}
