import { computed } from "vue";

import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useArchiveExams } from "@/pages/(app)/archive/api/useArchiveExams.ts";
import { useArchiveTableFilters } from "@/pages/(app)/archive/composables/useArchiveTableFilters.ts";
import {
    EXAM_STATUS_FILTER_KEY,
    TYPE_FILTER_KEY,
} from "@/pages/(app)/exam/composables/useExamFilters.ts";

export const useArchiveList = () => {
    const filterSections = useArchiveTableFilters();

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
        [TYPE_FILTER_KEY, EXAM_STATUS_FILTER_KEY],
        "startDate",
    );

    const selectedType = computed(() => selectedFilters.value[TYPE_FILTER_KEY]);
    const selectedStatus = computed(
        () => selectedFilters.value[EXAM_STATUS_FILTER_KEY],
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchExams,
    } = useArchiveExams(
        options,
        searchField,
        dateTimestamp,
        selectedType,
        selectedStatus,
    );

    const { items, pageCount, errors, reloadList } = usePagedListData({
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
        reloadList,
    };
};
