import { computed } from "vue";

import type { GetExamTemplatesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useExamTemplatesQuery } from "@/pages/(app)/exam-template/api/useExamTemplatesQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";

import {
    EXAM_TYPE_FILTER_KEY,
    useExamTemplateFilters,
} from "./useExamTemplateFilters.ts";

export const useExamTemplateList = () => {
    const filterSections = useExamTemplateFilters();

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
    } = useUrlTableState(async () => {}, [EXAM_TYPE_FILTER_KEY]);

    // TODO @andrei: it's a bit unfortunate that we have to set the default sorting like this. It would be better if useUrlTableState would accept a default sorting
    options.value.sortBy = [{ key: "name", order: "asc" }];

    const examTemplatesQuery = computed<GetExamTemplatesData["query"]>(() => ({
        ...toServerPageQuery(options.value),
        name: searchField.value || undefined,
        examType: selectedFilters.value[EXAM_TYPE_FILTER_KEY] || undefined,
    }));

    const {
        data,
        isFetching,
        error: queryError,
        refetch,
    } = useExamTemplatesQuery(examTemplatesQuery);
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
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        loadItems,
        reloadList,
    };
};
