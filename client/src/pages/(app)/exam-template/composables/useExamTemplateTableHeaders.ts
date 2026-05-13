import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types.ts";

export function useExamTemplateTableHeaders() {
    const { t } = useI18n();

    const headers = computed<TableHeader[]>(() => [
        {
            title: t("examTemplateList.headers.name"),
            key: "name",
            width: "30%",
            sortable: true,
        },
        {
            title: t("examTemplateList.headers.description"),
            key: "description",
            width: "30%",
            sortable: true,
        },
        {
            title: t("examTemplateList.headers.examType"),
            key: "examType",
            width: "30%",
            sortable: true,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        examType: (value) =>
            typeof value === "string" && value !== "" ? t(value) : "",
    };

    return { headers, cellFormatters };
}
