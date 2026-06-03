import { computed, type MaybeRefOrGetter, toValue } from "vue";
import type { TableHeader } from "@/components/widgets/entity-table/types.ts";

export function useTableHeaders(
    headers: MaybeRefOrGetter<TableHeader[]>,
    hasActions: MaybeRefOrGetter<boolean>,
    hasSelection: MaybeRefOrGetter<boolean>,
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

        if (toValue(hasSelection)) {
            base.unshift({
                title: "",
                key: "_selection",
                sortable: false,
                width: "1%",
                align: "center",
            });
        }

        return base;
    });

    return { computedHeaders };
}
