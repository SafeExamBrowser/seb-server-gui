import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useConnectionConfigurationsFilters } from "./useConnectionConfigurationsFilters.ts";
import { useConnectionConfigurations } from "@/pages/(app)/connection-configuration/api/useConnectionConfigurations.ts";

export const useConnectionConfigurationsList = () => {
    const filterSections = useConnectionConfigurationsFilters();

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
        await fetchConnectionConfigurations();
    }, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

    const selectedStatus = computed(() => selectedFilters.value.status);
    const selectedInstitutionId = computed(
        () => selectedFilters.value.institutionId,
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchConnectionConfigurations,
    } = useConnectionConfigurations(
        options,
        searchField,
        selectedStatus,
        selectedInstitutionId,
    );

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchConnectionConfigurations,
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
