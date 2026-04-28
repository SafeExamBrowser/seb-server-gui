import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationQueryRaw } from "vue-router";
import type { ServerTablePaging } from "@/models/types.ts";
import type {
    TableFilters,
    LoadItemsFn,
} from "@/components/blocks/entity-table/types.ts";

//standard options foer all Tables, @TODO Andrei consider using some sort of local storage for itemsPerPage???? Talk with team. Would make sense. // Additional Feature that users can configure their UI's in the future
const getDefaultOptions = (): ServerTablePaging => ({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
});

export function useUrlTableState(
    loadFn: LoadItemsFn,
    filterKeys: string[] = [],
    dateKey?: string,
) {
    const route = useRoute();
    const router = useRouter();

    let isInternalNavigation = false;

    const getQueryValue = (key: string): string | null => {
        const value = route.query[key];

        if (Array.isArray(value)) {
            return value[0] ?? null;
        }

        return value ?? null;
    };

    const managedQueryKeys = ["search", ...filterKeys];

    if (dateKey) {
        managedQueryKeys.push(dateKey);
    }

    const searchInputValue = ref<string | null>(getQueryValue("search"));
    const options = ref<ServerTablePaging>(getDefaultOptions());

    const searchField = computed(() => getQueryValue("search"));

    const selectedFilters = computed<TableFilters>(() => {
        const filters: TableFilters = {};

        for (const key of filterKeys) {
            filters[key] = getQueryValue(key);
        }

        return filters;
    });

    const dateTimestamp = computed<number | null>(() => {
        if (!dateKey) return null;
        const raw = getQueryValue(dateKey);

        if (!raw) return null;

        const timestamp = Number(raw);

        return Number.isNaN(timestamp) ? null : timestamp;
    });

    const dateValue = computed<Date | null>(() => {
        if (dateTimestamp.value === null) {
            return null;
        }

        return new Date(dateTimestamp.value);
    });

    const resetToFirstPage = () => {
        options.value = {
            ...options.value,
            page: 1,
        };
    };

    const buildQuery = (): LocationQueryRaw => {
        return { ...route.query };
    };

    const replaceQuery = async (query: LocationQueryRaw) => {
        isInternalNavigation = true;

        try {
            await router.replace({ query });
            await nextTick();
        } finally {
            isInternalNavigation = false;
        }
    };

    const updateQuery = async (update: (query: LocationQueryRaw) => void) => {
        const query = buildQuery();

        update(query);

        await replaceQuery(query);
        resetToFirstPage();
        await loadFn();
    };

    watch(
        () => managedQueryKeys.map((key) => getQueryValue(key)),
        async () => {
            if (isInternalNavigation) {
                return;
            }

            searchInputValue.value = searchField.value;
            resetToFirstPage();
            await loadFn();
        },
    );

    const loadItems = async (newOptions?: ServerTablePaging) => {
        if (newOptions) {
            options.value = newOptions;
        }

        await loadFn();
    };

    const onSearch = async () => {
        searchInputValue.value = searchInputValue.value || null;

        await updateQuery((query) => {
            if (searchInputValue.value) {
                query.search = searchInputValue.value;
                return;
            }

            delete query.search;
        });
    };

    const onClearSearch = async () => {
        searchInputValue.value = null;

        await updateQuery((query) => {
            delete query.search;
        });
    };

    const setFilters = async (newFilters: TableFilters) => {
        await updateQuery((query) => {
            for (const key of filterKeys) {
                query[key] = newFilters[key] || undefined;
            }
        });
    };

    const clearAll = async () => {
        searchInputValue.value = null;

        await updateQuery((query) => {
            query.search = undefined;
            if (dateKey) query[dateKey] = undefined;
            for (const key of filterKeys) {
                query[key] = undefined;
            }
        });
    };

    const setDate = async (date: Date | null) => {
        if (!dateKey) return;

        await updateQuery((query) => {
            query[dateKey] = date ? String(date.getTime()) : undefined;
        });
    };

    return {
        searchInputValue,
        searchField,
        selectedFilters,
        dateValue,
        dateTimestamp,
        options,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        setDate,
    };
}
