import { computed, type MaybeRefOrGetter, toValue } from "vue";

import type { TableHeader } from "@/components/widgets/entity-table/types.ts";

export const ACTIONS_COLUMN_KEY = "_actions";

export function useTableHeaders(
    headers: MaybeRefOrGetter<TableHeader[]>,
    hasActions: MaybeRefOrGetter<boolean>,
) {
    const computedHeaders = computed<TableHeader[]>(() => {
        const base = [...toValue(headers)];

        if (toValue(hasActions)) {
            base.push({
                title: "",
                key: ACTIONS_COLUMN_KEY,
                sortable: false,
                width: "1%",
                align: "center",
            });
        }

        return base;
    });

    return { computedHeaders };
}
