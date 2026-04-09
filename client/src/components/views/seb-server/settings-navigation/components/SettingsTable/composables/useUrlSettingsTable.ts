import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ServerTablePaging } from "@/models/types";
import type {
    PagedResponse,
    TableFilters,
    LoadItemsFn,
} from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";

export function useUrlSettingsTable<TResponse extends PagedResponse>(
    data: { value: TResponse | undefined },
    loadFn: LoadItemsFn,
    filterKeys: string[] = [],
    initialOptions?: ServerTablePaging,
) {
    const route = useRoute();
    const router = useRouter();

    // Local text input state — what the user is currently typing.
    // Initialized from URL so a refresh or shared link restores the input.
    const searchInputValue = ref<string | null>(
        (route.query.search as string) || null,
    );

    // Local pagination / sort state — intentionally NOT put in URL.
    // Pagination resets to page 1 on every search or filter change.
    const options = ref<ServerTablePaging>(
        initialOptions ?? {
            page: 1,
            itemsPerPage: 5,
            sortBy: [{ key: "name", order: "asc" }],
        },
    );

    // The search that was last *applied* (from URL).
    const searchField = computed(() => (route.query.search as string) || null);

    // Filters are read from URL and written back via router.replace.
    // Using a writable computed keeps v-model compatibility with SettingsFilters.
    const selectedFilters = computed<TableFilters>({
        get: () => {
            const f: TableFilters = {};
            for (const key of filterKeys) {
                f[key] = (route.query[key] as string) || null;
            }
            return f;
        },
        set: (newFilters: TableFilters) => {
            const query = buildBaseQuery();
            for (const key of filterKeys) {
                const val = newFilters[key];
                if (val) {
                    query[key] = val;
                } else {
                    query[key] = undefined;
                }
            }
            void router.replace({ query });
        },
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

    // Builds a query object from the current URL, preserving search and all
    // filter keys. Callers then overwrite or delete specific keys as needed.
    function buildBaseQuery(): Record<string, string | undefined> {
        const q: Record<string, string | undefined> = {};
        if (route.query.search) q.search = route.query.search as string;
        for (const key of filterKeys) {
            if (route.query[key]) q[key] = route.query[key] as string;
        }
        return q;
    }

    async function fetch() {
        await loadFn({
            options: options.value,
            searchField: searchField.value,
            filters: selectedFilters.value,
        });
    }

    // Watch URL search + filter params. Fires on:
    //   • back/forward navigation
    //   • programmatic router.push / router.replace from this composable
    // On every change: reset page to 1 and reload.
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
            // Only sync the search input when the URL search value itself changed
            // (e.g. back/forward navigation). Don't overwrite what the user is
            // currently typing just because a filter was toggled.
            if (newVal.search !== oldVal?.search) {
                searchInputValue.value = (newVal.search as string) || null;
            }
            options.value = { ...options.value, page: 1 };
            await fetch();
        },
        { deep: true },
    );

    // Called by SettingsTable's @update:options (pagination + sort changes).
    // Pagination is local state, so no URL update needed here.
    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = newOptions;
        }
        await fetch();
    }

    // Apply search — pushes a new history entry so the back button can undo it.
    async function onSearch() {
        const query = buildBaseQuery();
        const val = searchInputValue.value || undefined;
        if (val) {
            query.search = val;
        } else {
            delete query.search;
        }
        await router.push({ query });
        // URL watcher handles page reset + fetch.
    }

    // Clear search only — keeps filters intact.
    async function onClearSearch() {
        searchInputValue.value = null;
        const query = buildBaseQuery();
        delete query.search;
        await router.push({ query });
        // URL watcher handles page reset + fetch.
    }

    // Clear all filters — keeps search and sort intact.
    async function resetFilters() {
        const query = buildBaseQuery();
        for (const key of filterKeys) {
            query[key] = undefined;
        }
        await router.replace({ query });
        // URL watcher handles page reset + fetch.
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
        resetFilters,
    };
}
