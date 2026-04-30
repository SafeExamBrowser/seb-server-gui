import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

const TRANSLATION_PREFIX = "monitoringExams.main";

export function useMonitoringTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderName`),
            key: "quizName",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderStart`),
            key: "quizStartTime",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderEnd`),
            key: "quizEndTime",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderType`),
            key: "type",
            width: "8%",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderStatus`),
            key: "status",
            width: "8%",
            sortable: true,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        quizStartTime: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        quizEndTime: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        type: (value) => (value ? translate(String(value)) : ""),
        status: (value) => (value ? translate(String(value)) : ""),
    };

    return { headers, cellFormatters };
}
