import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";
import i18n from "@/i18n";

export function useCertificatesTableActions(deps: {
    onDelete: (item: TableItem) => void;
}) {
    return computed<TableAction[]>(() => [
        {
            key: "delete",
            icon: "mdi-delete",
            label: i18n.global.t("general.deleteButton"),
            tooltip: getTooltip,
            color: "error",
            onClick: deps.onDelete,
            disabled: isInUse,
        },
    ]);
}

function isInUse(item: TableItem): boolean {
    return item.inUse as boolean;
}

function getTooltip(item: TableItem): string {
    if (isInUse(item)) {
        return i18n.global.t(
            "certificates.deleteCertificateContext.tooltip_noDeletion",
        );
    } else {
        return i18n.global.t("certificates.deleteCertificateContext.tooltip");
    }
}
