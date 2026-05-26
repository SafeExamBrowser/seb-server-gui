import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useAnalyzeTableActions(deps: {
    onNavigate: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    // TODO action got log download and SPS search with exam preselected

    return computed<TableAction[]>(() => [
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            label: t("general.viewButton"),
            onClick: deps.onNavigate,
        },
    ]);
}
