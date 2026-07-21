import { computed, reactive } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useDeleteAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useDeleteAssessmentToolMutation.ts";
import { useTestAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useTestAssessmentToolMutation.ts";
import { useToggleAssessmentToolStatusMutation } from "@/pages/(app)/assessment-tool/api/useToggleAssessmentToolStatusMutation.ts";
import { useAssessmentToolTestFlow } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolTestFlow.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

import { useAssessmentToolsList } from "./useAssessmentToolsList.ts";
import { useAssessmentToolsTableActions } from "./useAssessmentToolsTableActions.ts";
import { useAssessmentToolsTableHeaders } from "./useAssessmentToolsTableHeaders.ts";

export const useAssessmentToolsOverview = () => {
    const router = useRouter();

    const assessmentToolDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | undefined =>
        item.id != null
            ? {
                  name: "/(app)/assessment-tool/[id]/",
                  params: { id: String(item.id) },
              }
            : undefined;

    const { headers, cellFormatters } = useAssessmentToolsTableHeaders();

    const list = useAssessmentToolsList();

    const {
        mutateAsync: removeAssessmentTool,
        error: deleteMutationError,
        isPending: deleteLoading,
    } = useDeleteAssessmentToolMutation();
    const deleteError = computed(() =>
        toAppErrorOrUndefined(deleteMutationError.value),
    );

    const deleteFlow = useEntityDeleteFlow({
        remove: async (item) => {
            try {
                await removeAssessmentTool(String(item.id));
            } catch {
                /* empty */
            }
        },
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "assessmenttool",
        detailTextOf: (item) => String(item.name ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const {
        changeAssessmentToolStatus,
        error: statusMutationError,
        isPending: statusLoading,
    } = useToggleAssessmentToolStatusMutation();
    const statusError = computed(() =>
        toAppErrorOrUndefined(statusMutationError.value),
    );

    const statusFlow = useEntityStatusFlow({
        toggle: async (item) => {
            try {
                await changeAssessmentToolStatus(
                    String(item.id),
                    !!item.active,
                );
            } catch {
                /* empty */
            }
        },
        error: statusError,
        loading: statusLoading,
        contextLabel: "assessmenttool.status",
        onStatusChangeSuccess: list.reloadList,
    });

    const testMutation = useTestAssessmentToolMutation();
    const testError = computed(() =>
        toAppErrorOrUndefined(testMutation.error.value),
    );

    const testFlow = useAssessmentToolTestFlow({
        run: (item) => testMutation.mutateAsync(Number(item.id)),
        error: testError,
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
