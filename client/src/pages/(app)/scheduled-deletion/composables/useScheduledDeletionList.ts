import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import {
    useScheduledDeleteFilters,
    STATUS_FILTER_KEY,
} from "./useScheduledDeletionFilters.ts";
import { fetchSchedueledDeletions } from "@/pages/(app)/scheduled-deletion/composables/api/fetchScheduledDeletions.ts";

export const useScheduledDeletionList = () => {
    const filterSections = useScheduledDeleteFilters();

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
            await fetchSchedueledDeletion();
        },
        [STATUS_FILTER_KEY],
        "dueTimestamp",
    );

    const selectedStatus = computed(
        () => selectedFilters.value[STATUS_FILTER_KEY],
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchSchedueledDeletion,
    } = fetchSchedueledDeletions(options, dateTimestamp, selectedStatus);

    const { items, pageCount, errors } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchSchedueledDeletion,
    });

    const reloadList = async () => {
        await fetchSchedueledDeletion();

        const maxPage = Math.max(1, pageCount.value);

        if (options.value.page <= maxPage) {
            return;
        }

        options.value.page = maxPage;

        await fetchSchedueledDeletion();
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
