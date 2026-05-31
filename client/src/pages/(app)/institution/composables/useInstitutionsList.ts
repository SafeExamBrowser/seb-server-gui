import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { useInstitutionsFilters } from "./useInstitutionsFilters.ts";
import { useInstitutions } from "@/pages/(app)/institution/api/useInstitutions.ts";

export const useInstitutionsList = () => {
    const filterSections = useInstitutionsFilters();

    const {
        searchInputValue,
        searchField,
        selectedFilters,
        options,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
    } = useUrlTableState(async () => {
        await fetchInstitutions();
    }, [STATUS_FILTER_KEY]);

    const selectedStatus = computed(() => selectedFilters.value.status);

    const {
        data,
        loading,
        error,
        fetchData: fetchInstitutions,
    } = useInstitutions(options, searchField, selectedStatus);

    const items = computed(() => data.value?.content ?? []);
    const pageCount = computed(() => data.value?.number_of_pages ?? 0);
    const errors = computed(() => (error.value ? [error.value] : []));

    const reloadList = async () => {
        await fetchInstitutions();

        const maxPage = Math.max(1, pageCount.value);

        if (options.value.page <= maxPage) {
            return;
        }

        options.value.page = maxPage;

        await fetchInstitutions();
    };

    return {
        items,
        pageCount,
        loading,
        errors,
        options,
        searchInputValue,
        searchField,
        selectedFilters,
        filterSections,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        loadItems,
        reloadList,
    };
};
