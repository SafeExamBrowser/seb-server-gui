import { computed } from "vue";
import { useI18n } from "vue-i18n";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

export function useCertificatesTableActions(deps: {
    onDelete: (item: TableItem) => void;
}) {
    const { t } = useI18n();

    return computed<TableAction[]>(() => [
        {
            key: "delete",
            icon: "mdi-delete",
            label: t("general.deleteButton"),
            color: "error",
            onClick: deps.onDelete,
        },
    ]);
}
