import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import {
    formatTimestampToDate,
    formatTimestampToFullDate,
} from "@/utils/timeUtils.ts";
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
            title: translate(`${TRANSLATION_PREFIX}.headerScheduleTime`),
            key: "scheduleTime",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.headerDueTime`),
            key: "deleteDueTime",
            sortable: false,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.headerStatus`),
            key: "state",
            width: "8%",
            sortable: false,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        deleteDueTime: (value) =>
            value ? formatTimestampToDate(Number(value)) : "",
        scheduleTime: (value) =>
            value ? formatTimestampToFullDate(String(value)) : "",
        state: (value) =>
            value ? translate(`scheduledDelete.status.${String(value)}`) : "",
    };

    return { headers, cellFormatters };
}
