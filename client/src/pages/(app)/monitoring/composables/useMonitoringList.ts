import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import {
    useMonitoringFilters,
    TYPE_FILTER_KEY,
    MONITORING_STATUS_FILTER_KEY,
} from "./useMonitoringFilters.ts";
import { useMonitoringExams } from "@/pages/(app)/monitoring/api/useMonitoringExams.ts";

export const useMonitoringList = () => {
    const filterSections = useMonitoringFilters();

    const {
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
    } = useUrlTableState(
        async () => {
            await fetchExams();
        },
        [TYPE_FILTER_KEY, MONITORING_STATUS_FILTER_KEY],
        "startDate",
    );

    const selectedType = computed(() => selectedFilters.value[TYPE_FILTER_KEY]);
    const selectedStatus = computed(
        () => selectedFilters.value[MONITORING_STATUS_FILTER_KEY],
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchExams,
    } = useMonitoringExams(
        options,
        searchField,
        dateTimestamp,
        selectedType,
        selectedStatus,
    );

    const { items, pageCount, errors } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchExams,
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
        dateValue,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        setDate,
        loadItems,
    };
};
