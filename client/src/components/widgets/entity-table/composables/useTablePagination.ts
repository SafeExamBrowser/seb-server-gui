import { computed, type MaybeRefOrGetter, toValue } from "vue";
import type { ServerTablePaging } from "@/models/types.ts";

type SortItemForTable = { key: string; order?: boolean | "asc" | "desc" };

export const DEFAULT_ITEMS_PER_PAGE = 5;

export function useTablePagination(deps: {
    options: MaybeRefOrGetter<ServerTablePaging | undefined>;
    itemsPerPage: MaybeRefOrGetter<number | undefined>;
    pageCount: MaybeRefOrGetter<number | undefined>;
    items: MaybeRefOrGetter<readonly unknown[]>;
    itemsLength: MaybeRefOrGetter<number | undefined>;
    emit: (options: ServerTablePaging) => void;
}) {
    const currentPage = computed(() => toValue(deps.options)?.page ?? 1);

    const currentItemsPerPage = computed(
        () =>
            toValue(deps.options)?.itemsPerPage ??
            toValue(deps.itemsPerPage) ??
            DEFAULT_ITEMS_PER_PAGE,
    );

    const resolvedPageCount = computed(() => toValue(deps.pageCount) ?? 0);

    const itemsPerPageOptions = computed(() => {
        const pc = resolvedPageCount.value;
        const ic = toValue(deps.items).length;
        const opts = [5];

        if (pc > 1 || ic > 5) opts.push(10);
        if (pc > 2 || ic > 10) opts.push(15);

        return opts;
    });

    const internalItemsLength = computed(() => {
        const override = toValue(deps.itemsLength);
        if (override !== undefined) return override;

        const page = currentPage.value;
        const perPage = currentItemsPerPage.value;
        const pc = resolvedPageCount.value;
        const ic = toValue(deps.items).length;

        if (pc === 0) return ic;
        if (page === pc) {
            return (pc - 1) * perPage + ic;
        }
        return pc * perPage;
    });

    const sortByForTable = computed<SortItemForTable[]>(() =>
        (toValue(deps.options)?.sortBy ?? []).map((s) => ({
            key: s.key,
            order: s.order as "asc" | "desc" | undefined,
        })),
    );

    function emitOptionsUpdate(partial: Partial<ServerTablePaging>) {
        deps.emit({
            page: currentPage.value,
            itemsPerPage: currentItemsPerPage.value,
            sortBy: toValue(deps.options)?.sortBy ?? [],
            ...partial,
        });
    }

    function onPageUpdate(page: number) {
        emitOptionsUpdate({ page });
    }

    function onItemsPerPageUpdate(itemsPerPage: number) {
        emitOptionsUpdate({ page: 1, itemsPerPage });
    }

    return {
        currentPage,
        currentItemsPerPage,
        resolvedPageCount,
        itemsPerPageOptions,
        internalItemsLength,
        sortByForTable,
        onPageUpdate,
        onItemsPerPageUpdate,
    };
}
