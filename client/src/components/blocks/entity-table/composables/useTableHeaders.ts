import { computed, type MaybeRefOrGetter, toValue } from "vue";
import type { TableHeader } from "@/components/blocks/entity-table/types.ts";

export function useTableHeaders(
    headers: MaybeRefOrGetter<TableHeader[]>,
    hasActions: MaybeRefOrGetter<boolean>,
) {
    const computedHeaders = computed<TableHeader[]>(() => {
        const base = [...toValue(headers)];

        if (toValue(hasActions)) {
            base.push({
                title: "",
                key: "_actions",
                sortable: false,
                width: "1%",
                align: "center",
            });
        }

        return base;
    });

    return { computedHeaders };
}
