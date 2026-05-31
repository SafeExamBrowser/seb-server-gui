import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
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

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchInstitutions,
    });

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
