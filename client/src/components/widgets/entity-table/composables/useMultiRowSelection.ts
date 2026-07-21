import { computed, ref } from "vue";

import type {
    TableItem,
    TableRowSelect,
} from "@/components/widgets/entity-table/types.ts";

export function useMultiRowSelection(deps: {
    key: string;
    rowSelectionDisabled?: (item: TableItem) => boolean;
}) {
    const selectedIds = ref<string[]>([]);

    return computed<TableRowSelect>(() => {
        return {
            key: deps.key,
            disabled: deps.rowSelectionDisabled,
            selectionModel: selectedIds,
        };
    });
}
