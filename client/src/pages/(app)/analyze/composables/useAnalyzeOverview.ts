import { reactive } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useAnalyzeList } from "@/pages/(app)/analyze/composables/useAnalyzeList.ts";
import { useAnalyzeTableActions } from "@/pages/(app)/analyze/composables/useAnalyzeTableActions.ts";
import { useExamTableHeaders } from "@/pages/(app)/exam/composables/useExamTableHeaders.ts";

export const useAnalyzeOverview = () => {
    const router = useRouter();

    const showSPS = async (item: TableItem) => {
        if (!item.quizName) {
            return;
        }

        const target: RouteLocationAsRelative = {
            name: "/(app)/sp-search/",
            query: {
                examName: String(item.quizName),
                startDate: String(item.startDate),
            },
        };

        await router.push(target);
    };

    const { headers, cellFormatters } = useExamTableHeaders();

    const list = useAnalyzeList();

    const actions = useAnalyzeTableActions({ onShowSPS: showSPS });

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: list.loading,
            actions,
            searchInputValue: list.searchInputValue,
            searchField: list.searchField,
            selectedFilters: list.selectedFilters,
            filterSections: list.filterSections,
            dateValue: list.dateValue,
            onSearch: list.onSearch,
            onClearSearch: list.onClearSearch,
            setFilters: list.setFilters,
            setDate: list.setDate,
            clearAll: list.clearAll,
            loadItems: list.loadItems,
        }),
    };
};
