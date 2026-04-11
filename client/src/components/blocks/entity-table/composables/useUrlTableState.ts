import { computed, ref, watch } from "vue";
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
) {
    const route = useRoute();
    const router = useRouter();

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
            return watched;
        },
        async (newVal, oldVal) => {
            if (newVal.search !== oldVal?.search) {
                searchInputValue.value = (newVal.search as string) || null;
            }
            options.value = { ...options.value, page: 1 };
            await loadFn();
        },
        { deep: true },
    );

    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = newOptions;
        }
        await loadFn();
    }

    async function onSearch() {
        const query = buildBaseQuery();
        query.search = searchInputValue.value || undefined;
        await router.replace({ query });
    }

    async function onClearSearch() {
        searchInputValue.value = null;
        const query = buildBaseQuery();
        query.search = undefined;
        await router.replace({ query });
    }

    async function setFilters(newFilters: TableFilters) {
        const query = buildBaseQuery();
        for (const key of filterKeys) {
            query[key] = newFilters[key] || undefined;
        }
        await router.replace({ query });
    }

    async function resetFilters() {
        const query = buildBaseQuery();
        for (const key of filterKeys) {
            query[key] = undefined;
        }
        await router.replace({ query });
    }

    return {
        searchInputValue,
        searchField,
        selectedFilters,
        options,
        totalItems,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        resetFilters,
    };
}
