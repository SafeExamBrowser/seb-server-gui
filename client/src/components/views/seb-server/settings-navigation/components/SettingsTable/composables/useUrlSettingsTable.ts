import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ServerTablePaging } from "@/models/types";
import type {
    PagedResponse,
    TableFilters,
    LoadItemsFn,
} from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";

export function useUrlSettingsTable<TResponse extends PagedResponse>(
    data: Ref<TResponse | undefined>,
    loadFn: LoadItemsFn,
    filterKeys: string[] = [],
    initialOptions?: ServerTablePaging,
) {
    const route = useRoute();
    const router = useRouter();

    const searchInputValue = ref<string | null>(
        (route.query.search as string) || null,
    );

    const options = ref<ServerTablePaging>(
        initialOptions ?? {
            page: 1,
            itemsPerPage: 5,
            sortBy: [{ key: "name", order: "asc" }],
        },
    );

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

    const hasActiveFilters = computed(() =>
        filterKeys.some((key) => !!route.query[key]),
    );

    function buildBaseQuery(): Record<string, string | undefined> {
        const q: Record<string, string | undefined> = {};
        if (route.query.search) q.search = route.query.search as string;
        for (const key of filterKeys) {
            if (route.query[key]) q[key] = route.query[key] as string;
        }
        return q;
    }

    async function refetch() {
        await loadFn({
            options: options.value,
            searchField: searchField.value,
            filters: selectedFilters.value,
        });
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
            await refetch();
        },
        { deep: true },
    );
    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = newOptions;
        }
        await refetch();
    }

    async function onSearch() {
        const query = buildBaseQuery();
        const val = searchInputValue.value || undefined;
        query.search = val || undefined;
        await router.push({ query });
    }

    async function onClearSearch() {
        searchInputValue.value = null;
        const query = buildBaseQuery();
        query.search = undefined;
        await router.push({ query });
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
        hasActiveFilters,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        resetFilters,
    };
}
