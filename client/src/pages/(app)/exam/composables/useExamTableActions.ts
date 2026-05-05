import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useExamTableActions(deps: {
    onNavigate: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            label: t("general.viewButton"),
            onClick: deps.onNavigate,
        },
    ]);
}
