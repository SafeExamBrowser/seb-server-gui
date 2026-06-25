import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

const TRANSLATION_PREFIX = "scheduledDelete.list";

export function useScheduledDeleteTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate(`${TRANSLATION_PREFIX}.headerName`),
            key: "sdName",
            sortable: false,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.headerDueTime`),
            key: "dueTime",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.headerScheduleTime`),
            key: "scheduleTime",
            sortable: false,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.headerStatus`),
            key: "status",
            width: "8%",
            sortable: true,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        sdName: (value) =>
            value ? `Report ${formatIsoToReadableDateTime(String(value))}` : "",
        dueTime: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        scheduleTime: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        status: (value) =>
            value ? translate(`scheduledDelete.status.${String(value)}`) : "",
    };

    return { headers, cellFormatters };
}
