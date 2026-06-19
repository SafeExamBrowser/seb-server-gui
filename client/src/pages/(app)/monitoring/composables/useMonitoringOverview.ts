import { reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useMonitoringTableHeaders } from "./useMonitoringTableHeaders.ts";
import { useMonitoringTableActions } from "./useMonitoringTableActions.ts";
import { useMonitoringList } from "./useMonitoringList.ts";

export const useMonitoringOverview = () => {
    const router = useRouter();

    const monitoringDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/monitoring/[examId]/",
                  params: { examId: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } = useMonitoringTableHeaders();

    const list = useMonitoringList();

    const actions = useMonitoringTableActions({
        onNavigate: (item) => {
            const target = monitoringDetailRoute(item);
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
            detailRoute: monitoringDetailRoute,
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
