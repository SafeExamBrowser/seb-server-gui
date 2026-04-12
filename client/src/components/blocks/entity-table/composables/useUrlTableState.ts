import { computed, nextTick, ref, watch } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ServerTablePaging } from "@/models/types.ts";
import type {
    PagedResponse,
    TableFilters,
    LoadItemsFn,
} from "@/components/blocks/entity-table/types.ts";

export function useUrlTableState<TResponse extends PagedResponse>(
    data: Ref<TResponse | undefined>,
    loadFn: LoadItemsFn,
    filterKeys: string[] = [],
    dateKey?: string,
) {
    const route = useRoute();
    const router = useRouter();

    let isInternalNavigation = false;

    const searchInputValue = ref<string | null>(
        (route.query.search as string) || null,
    );

    const options = ref<ServerTablePaging>({
        page: 1,
        itemsPerPage: 5,
        sortBy: [{ key: "name", order: "asc" }],
    });

    const searchField = computed(() => (route.query.search as string) || null);

    const selectedFilters = computed<TableFilters>(() => {
        const f: TableFilters = {};
        for (const key of filterKeys) {
            f[key] = (route.query[key] as string) || null;
        }
        return f;
    });

    const dateValue = computed<Date | null>(() => {
        if (!dateKey) return null;
        const raw = route.query[dateKey] as string;
        if (!raw) return null;
        const ts = Number(raw);
        return isNaN(ts) ? null : new Date(ts);
    });

    const dateTimestamp = computed<number | null>(
        () => dateValue.value?.getTime() ?? null,
    );

    const totalItems = computed(() => {
        if (!data.value) return 0;
        return (
            (data.value.number_of_pages ?? 1) *
            (data.value.page_size ?? data.value.content?.length ?? 0)
        );
    });

    function buildBaseQuery(): Record<string, string | undefined> {
        const q: Record<string, string | undefined> = {};
        if (route.query.search) q.search = route.query.search as string;
        for (const key of filterKeys) {
            if (route.query[key]) q[key] = route.query[key] as string;
        }
        if (dateKey && route.query[dateKey]) {
            q[dateKey] = route.query[dateKey] as string;
        }
        return q;
    }

    watch(
        () => {
            const watched: Record<string, string | null> = {
                search: (route.query.search as string) || null,
            };
            for (const key of filterKeys) {
                watched[key] = (route.query[key] as string) || null;
            }
            if (dateKey) {
                watched[dateKey] = (route.query[dateKey] as string) || null;
            }
            return watched;
        },
        async (newVal) => {
            if (isInternalNavigation) return;
            searchInputValue.value = newVal.search || null;
            options.value = { ...options.value, page: 1 };
            await loadFn();
        },
        { deep: true },
    );

    async function navigate(query: Record<string, string | undefined>) {
        isInternalNavigation = true;
        try {
            await router.replace({ query });
            await nextTick();
        } finally {
            isInternalNavigation = false;
        }
    }

    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = newOptions;
        }
        await loadFn();
    }

    async function onSearch() {
        const query = buildBaseQuery();
        query.search = searchInputValue.value || undefined;
        await navigate(query);
        options.value = { ...options.value, page: 1 };
        await loadFn();
    }

    async function onClearSearch() {
        searchInputValue.value = null;
        const query = buildBaseQuery();
        query.search = undefined;
        await navigate(query);
    }

    async function setFilters(newFilters: TableFilters) {
        const query = buildBaseQuery();
        for (const key of filterKeys) {
            query[key] = newFilters[key] || undefined;
        }
        await navigate(query);
        options.value = { ...options.value, page: 1 };
        await loadFn();
    }

    async function resetFilters() {
        const query = buildBaseQuery();
        for (const key of filterKeys) {
            query[key] = undefined;
        }
        if (dateKey) {
            query[dateKey] = undefined;
        }
        await navigate(query);
        options.value = { ...options.value, page: 1 };
        await loadFn();
    }

    async function clearAll() {
        searchInputValue.value = null;
        await navigate({});
        options.value = { ...options.value, page: 1 };
        await loadFn();
    }

    async function setDate(date: Date | null) {
        if (!dateKey) return;
        const query = buildBaseQuery();
        query[dateKey] = date ? String(date.getTime()) : undefined;
        await navigate(query);
        options.value = { ...options.value, page: 1 };
        await loadFn();
    }

    return {
        searchInputValue,
        searchField,
        selectedFilters,
        dateValue,
        dateTimestamp,
        options,
        totalItems,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        resetFilters,
        clearAll,
        setDate,
    };
}
