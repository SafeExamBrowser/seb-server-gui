import { reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useExamTableHeaders } from "./useExamTableHeaders.ts";
import { useExamTableActions } from "./useExamTableActions.ts";
import { useExamList } from "./useExamList.ts";

export const useExamOverview = () => {
    const router = useRouter();

    const examDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/exam/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } = useExamTableHeaders();

    const list = useExamList();

    const actions = useExamTableActions({
        onNavigate: (item) => {
            const target = examDetailRoute(item);
            if (!target) {
                // TODO @andrei implement error handling
                return;
            }
            void router.push(target);
        },
    });

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: list.loading,
            detailRoute: examDetailRoute,
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
