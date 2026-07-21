import { computed, type MaybeRefOrGetter, toValue } from "vue";

import type { ServerTablePaging } from "@/models/types.ts";

type SortItemForTable = { key: string; order?: boolean | "asc" | "desc" };

const DEFAULT_ITEMS_PER_PAGE = 10;

export function useTablePagination(deps: {
    options: MaybeRefOrGetter<ServerTablePaging | undefined>;
    itemsPerPage: MaybeRefOrGetter<number | undefined>;
    pageCount: MaybeRefOrGetter<number | undefined>;
    items: MaybeRefOrGetter<readonly unknown[]>;
    itemsLength: MaybeRefOrGetter<number | undefined>;
    emit: (options: ServerTablePaging) => void;
}) {
    const currentPage = computed(() => toValue(deps.options)?.page ?? 1);

    const requestedItemsPerPage = computed(
        () =>
            toValue(deps.options)?.itemsPerPage ??
            toValue(deps.itemsPerPage) ??
            DEFAULT_ITEMS_PER_PAGE,
    );

    const resolvedPageCount = computed(() => toValue(deps.pageCount) ?? 0);

    const internalItemsLength = computed(() => {
        const override = toValue(deps.itemsLength);
        if (override !== undefined) return override;

        const page = currentPage.value;
        const perPage = requestedItemsPerPage.value;
        const pc = resolvedPageCount.value;
        const ic = toValue(deps.items).length;

        if (pc === 0) return ic;
        if (page === pc) {
            return (pc - 1) * perPage + ic;
        }
        return pc * perPage;
    });

    const itemsPerPageOptions = computed(() => {
        const total = internalItemsLength.value;
        const opts = [5];

        if (total > 5) {
            opts.push(10);
        }
        if (total > 10) {
            opts.push(15);
        }

        return opts;
    });

    const currentItemsPerPage = computed(() => {
        const requested = requestedItemsPerPage.value;

        if (toValue(deps.items).length === 0) {
            return requested;
        }

        const options = itemsPerPageOptions.value;
        const maxOption = options[options.length - 1];

        return Math.min(requested, maxOption);
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
            itemsPerPage: requestedItemsPerPage.value,
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
        requestedItemsPerPage,
        resolvedPageCount,
        itemsPerPageOptions,
        internalItemsLength,
        sortByForTable,
        onPageUpdate,
        onItemsPerPageUpdate,
    };
}
