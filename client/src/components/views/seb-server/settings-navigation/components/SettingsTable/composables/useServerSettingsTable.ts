import { computed, ref } from "vue";
import type { ServerTablePaging } from "@/models/types";
import type { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract";
import type {
    PagedResponse,
    TableFilters,
    LoadItemsFn,
} from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";

export function useServerSettingsTable<TResponse extends PagedResponse>(
    store: BaseSettingsStoreView<unknown>,
    data: { value: TResponse | undefined },
    loadFn: LoadItemsFn,
    initialOptions?: ServerTablePaging,
    initialFilters?: TableFilters,
) {
    const selectedFilters = ref<TableFilters>(initialFilters ?? {});

    const options = ref<ServerTablePaging>(
        initialOptions ?? {
            page: 1,
            itemsPerPage: 5,
            sortBy: [{ key: "name", order: "asc" }],
        },
    );

    function getSafeOptions(
        newOptions?: Partial<ServerTablePaging>,
    ): ServerTablePaging {
        return {
            page: newOptions?.page ?? options.value.page ?? 1,
            itemsPerPage:
                newOptions?.itemsPerPage ?? options.value.itemsPerPage ?? 10,
            sortBy: newOptions?.sortBy ?? options.value.sortBy ?? [],
        };
    }

    function setFilter(key: string, value: string | null) {
        selectedFilters.value = {
            ...selectedFilters.value,
            [key]: value,
        };
    }

    function setFilters(filters: TableFilters) {
        selectedFilters.value = {
            ...filters,
        };
    }

    function resetFilters() {
        const reset: TableFilters = {};

        Object.keys(selectedFilters.value).forEach((key) => {
            reset[key] = null;
        });

        selectedFilters.value = reset;
    }

    const totalItems = computed(() => {
        if (!data.value) return 0;

        return (
            (data.value.number_of_pages ?? 1) *
            (data.value.page_size ?? data.value.content?.length ?? 0)
        );
    });

    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = getSafeOptions(newOptions);
        } else {
            options.value = getSafeOptions();
        }

        store.currentPagingOptions = options.value;

        await loadFn({
            options: options.value,
            searchField: store.searchField,
            filters: selectedFilters.value,
        });
    }

    async function onSearch() {
        options.value = getSafeOptions({
            page: 1,
        });

        await loadItems();
    }

    async function onClearSearch() {
        resetFilters();

        options.value = getSafeOptions({
            page: 1,
        });

        await loadItems();
    }

    return {
        selectedFilters,
        options,
        totalItems,
        loadItems,
        onSearch,
        onClearSearch,
        getSafeOptions,
        setFilter,
        setFilters,
        resetFilters,
    };
}
