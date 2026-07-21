import { reactive } from "vue";
import { RouteLocationAsRelative } from "vue-router";

import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import { useMultiRowSelection } from "@/components/widgets/entity-table/composables/useMultiRowSelection";
import { useMultiSelectionFlow } from "@/components/widgets/entity-table/composables/useMultiSelectionFlow";
import { TableItem } from "@/components/widgets/entity-table/types";
import { SearchBarAction } from "@/components/widgets/searches/types";
import { Exam } from "@/models/seb-server/exam";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import { useDoArchiveExams } from "@/pages/(app)/archive/api/useDoArchiveExams";
import { useArchiveList } from "@/pages/(app)/archive/composables/useArchiveList.ts";
import { useArchiveTableActions } from "@/pages/(app)/archive/composables/useArchiveTableAdditions";
import { useExamTableHeaders } from "@/pages/(app)/exam/composables/useExamTableHeaders.ts";
import router from "@/router/router";

export const useArchiveOverview = () => {
    const { headers, cellFormatters } = useExamTableHeaders();

    const list = useArchiveList();

    const {
        archiveSingleExam,
        archiveMultipleExams,
        error: statusError,
        loading: statusLoading,
    } = useDoArchiveExams();

    const archiveSingleFlow = useEntityStatusFlow({
        toggle: archiveSingleExam,
        error: statusError,
        loading: statusLoading,
        contextLabel: "exam.archive",
        onStatusChangeSuccess: list.reloadList,
    });

    const multiSelectionFlow = useMultiSelectionFlow({
        process: archiveMultipleExams,
        clearSelection: () => (multiSelection.value.selectionModel.value = []),
        error: statusError,
        loading: statusLoading,
        contextLabel: "exam.archive",
        onSuccess: list.reloadList,
    });

    const examDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/exam/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const rowActions = useArchiveTableActions({
        onArchiveExam: archiveSingleFlow.openStatusDialog,
        canArchiveExam: canArchive,
        onNavigate: (item) => {
            const target = examDetailRoute(item);
            if (!target) {
                // TODO @andrei implement error handling
                return;
            }
            void router.push(target);
        },
    });

    const multiSelection = useMultiRowSelection({
        key: "id",
        rowSelectionDisabled: (item) => !canArchive(item),
    });

    const multiSelectionActions: SearchBarAction[] = [
        {
            key: "archiveAll",
            icon: "mdi-archive",
            label: "examList.actions.archiveSelected",
            onClick: () =>
                multiSelectionFlow.openActionDialog(multiSelection.value),
            disabled: () =>
                multiSelection.value.selectionModel.value.length < 1,
        },
    ];

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: list.loading,
            actions: rowActions,
            selection: multiSelection,
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
        archiveFlow: reactive({
            dialogOpen: archiveSingleFlow.statusDialogOpen,
            target: archiveSingleFlow.statusTarget,
            openDialog: archiveSingleFlow.openStatusDialog,
            confirm: archiveSingleFlow.confirmStatusChange,
        }),
        archiveMultiFlow: reactive({
            dialogOpen: multiSelectionFlow.selectionDialogOpen,
            target: multiSelectionFlow.selectionTarget,
            openDialog: multiSelectionFlow.openActionDialog,
            confirm: multiSelectionFlow.confirmAction,
            loading: multiSelectionFlow.statusLoading,
        }),
        multiSelectionActions,
    };
};

function canArchive(item: TableItem): boolean {
    const exam: Exam = item as Exam;
    return exam.status !== ExamStatusEnum.ARCHIVED;
}
