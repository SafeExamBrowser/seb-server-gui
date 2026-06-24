import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useAssessmentToolsTableHeaders } from "./useAssessmentToolsTableHeaders.ts";
import { useAssessmentToolsTableActions } from "./useAssessmentToolsTableActions.ts";
import { useAssessmentToolsList } from "./useAssessmentToolsList.ts";
import { useDeleteAssessmentTool } from "@/pages/(app)/assessment-tool/api/useDeleteAssessmentTool.ts";
import { useToggleAssessmentToolStatus } from "@/pages/(app)/assessment-tool/api/useToggleAssessmentTool.ts";
import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import { useAssesmentToolTestFlow } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolTestFlow.ts";
import { useTestAssessmentTool } from "@/pages/(app)/assessment-tool/api/useTestAssessmentTool.ts";

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

    const {
        removeAssessmentToolFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteAssessmentTool();

    const deleteFlow = useEntityDeleteFlow({
        remove: removeAssessmentToolFromItem,
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "assessmenttool",
        detailTextOf: (item) => String(item.name ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const {
        toggleAssessmentToolStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleAssessmentToolStatus();

    const statusFlow = useEntityStatusFlow({
        toggle: toggleAssessmentToolStatusFromItem,
        error: statusError,
        loading: statusLoading,
        contextLabel: "assessmenttool.status",
        onStatusChangeSuccess: list.reloadList,
    });

    const {
        testeAssessmentToolFromItem,
        error: testError,
        testResult: testResult,
        loading: testLoading,
    } = useTestAssessmentTool();

    const testFlow = useAssesmentToolTestFlow({
        test: testeAssessmentToolFromItem,
        testResult: testResult,
        error: testError,
        loading: testLoading,
        contextLabel: "assessmentToolConnections.test",
    });

    const tableLoading = computed(
        () =>
            list.loading.value ||
            deleteFlow.deleteLoading.value ||
            statusFlow.statusLoading.value,
    );

    const actions = useAssessmentToolsTableActions({
        onTest: testFlow.testAssessmentTool,
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
