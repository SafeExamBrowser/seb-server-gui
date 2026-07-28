import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useMonitoringTableActions(deps: {
    onNavigate: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "navigate",
            icon: "mdi-chevron-right",
            label: i18n.global.t("general.viewButton"),
            onClick: deps.onNavigate,
        },
    ]);
}
