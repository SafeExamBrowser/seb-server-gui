import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import {
    useExamFilters,
    TYPE_FILTER_KEY,
    EXAM_STATUS_FILTER_KEY,
} from "./useExamFilters.ts";
import { useExams } from "@/pages/(app)/exam/api/useExams.ts";

export const useExamList = () => {
    const filterSections = useExamFilters();

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
    } = useExams(
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
