import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useAssessmentToolsTableHeaders } from "./useAssessmentToolsTableHeaders.ts";
import { useAssessmentToolsTableActions } from "./useAssessmentToolsTableActions.ts";
import { useAssessmentToolsList } from "./useAssessmentToolsList.ts";
import { useAssessmentToolsDeleteFlow } from "./useAssessmentToolsDeleteFlow.ts";
import { useAssessmentToolsStatusFlow } from "./useAssessmentToolsStatusFlow.ts";

export const useAssessmentToolsOverview = () => {
    const router = useRouter();

    const assessmentToolDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/assessment-tool/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } = useAssessmentToolsTableHeaders();

    const list = useAssessmentToolsList();

    const deleteFlow = useAssessmentToolsDeleteFlow({
        onDeleteSuccess: list.reloadList,
    });

    const statusFlow = useAssessmentToolsStatusFlow({
        onStatusChangeSuccess: list.reloadList,
    });

    const tableLoading = computed(
        () =>
            list.loading.value ||
            deleteFlow.deleteLoading.value ||
            statusFlow.statusLoading.value,
    );

    const actions = useAssessmentToolsTableActions({
        onEdit: (item) => {
            const target = assessmentToolDetailRoute(item);
            if (!target) {
                return;
            }
            void router.push(target);
        },
        onDelete: deleteFlow.openDeleteDialog,
    });

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: tableLoading,
            detailRoute: assessmentToolDetailRoute,
            actions,
            searchInputValue: list.searchInputValue,
            searchField: list.searchField,
            selectedFilters: list.selectedFilters,
            filterSections: list.filterSections,
            onSearch: list.onSearch,
            onClearSearch: list.onClearSearch,
            setFilters: list.setFilters,
            clearAll: list.clearAll,
            loadItems: list.loadItems,
        }),
        deleteFlow: reactive({
            dialogOpen: deleteFlow.deleteDialogOpen,
            detailText: deleteFlow.deleteDetailText,
            confirm: deleteFlow.confirmDelete,
        }),
        statusFlow: reactive({
            dialogOpen: statusFlow.statusDialogOpen,
            target: statusFlow.statusTarget,
            openDialog: statusFlow.openStatusDialog,
            confirm: statusFlow.confirmStatusChange,
        }),
    };
};
