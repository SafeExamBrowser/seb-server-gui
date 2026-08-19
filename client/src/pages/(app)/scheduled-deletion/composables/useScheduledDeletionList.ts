import { computed } from "vue";

import type { GetScheduledDeletesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { toWireScheduledDeleteState } from "@/models/scheduledDeletion.ts";
import { useScheduledDeletesQuery } from "@/pages/(app)/scheduled-deletion/composables/api/useScheduledDeletesQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";

import {
    STATUS_FILTER_KEY,
    useScheduledDeleteFilters,
} from "./useScheduledDeletionFilters.ts";

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
    } = useUrlTableState(async () => {}, [STATUS_FILTER_KEY], "dueTimestamp");

    const scheduledDeletesQuery = computed<GetScheduledDeletesData["query"]>(
        () => ({
            ...toServerPageQuery(options.value),
            dueTimestamp: dateTimestamp.value ?? undefined,
            state: toWireScheduledDeleteState(
                selectedFilters.value[STATUS_FILTER_KEY],
            ),
        }),
    );

    const {
        data,
        isFetching,
        error: queryError,
        refetch,
    } = useScheduledDeletesQuery(scheduledDeletesQuery);
    const error = computed(() => toAppErrorOrUndefined(queryError.value));

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: async () => {
            await refetch();
        },
    });

    return {
        items,
        pageCount,
        loading: isFetching,
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
