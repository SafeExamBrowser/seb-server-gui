import { computed } from "vue";

import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useExamTemplateTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: i18n.global.t("examTemplateList.headers.name"),
            key: "name",
            width: "30%",
            sortable: true,
        },
        {
            title: i18n.global.t("examTemplateList.headers.description"),
            key: "description",
            width: "30%",
            sortable: true,
        },
        {
            title: i18n.global.t("examTemplateList.headers.examType"),
            key: "examType",
            width: "30%",
            sortable: true,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        examType: (value) =>
            typeof value === "string" && value !== ""
                ? i18n.global.t(value)
                : "",
    };

    return { headers, cellFormatters };
}
