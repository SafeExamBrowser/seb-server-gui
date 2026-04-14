import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { SebTableHeader } from "@/components/views/seb-server/composables/sebServerTableHeaderTypes.ts";

const TRANSLATION_PREFIX = "monitoringExams.main";

export const useMonitoringTableHeaders = () => {
    return computed<SebTableHeader[]>(() => [
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderName`),
            key: "quizName",
            sortable: true,
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderStart`),
            key: "quizStartTime",
            sortable: true,
            translateType: "dateTime",
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderEnd`),
            key: "quizEndTime",
            sortable: true,
            translateType: "dateTime",
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderType`),
            key: "type",
            width: "8%",
            sortable: true,
            translateType: "examType",
        },
        {
            title: translate(`${TRANSLATION_PREFIX}.tableHeaderStatus`),
            key: "status",
            width: "8%",
            sortable: true,
            translateType: "examStatus",
        },
    ]);
};
