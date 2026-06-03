import { reactive } from "vue";
import { useExamTableHeaders } from "@/pages/(app)/exam/composables/useExamTableHeaders.ts";
import {
    useArchiveTableActions,
    useArchiveTableSelection,
} from "@/pages/(app)/archive/composables/useArchiveTableActions.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import { useArchiveList } from "@/pages/(app)/archive/composables/useArchiveList.ts";
import { useDoArchiveExams } from "@/pages/(app)/archive/api/useDoArchiveExams";
import { TableItem } from "@/components/widgets/entity-table/types";

export const useArchiveOverview = () => {
    const { headers, cellFormatters } = useExamTableHeaders();

    const list = useArchiveList();

    const {
        archiveSingleExam,
        error: statusError,
        loading: statusLoading,
    } = useDoArchiveExams();

    const archiveFlow = useEntityStatusFlow({
        toggle: archiveSingleExam,
        error: statusError,
        loading: statusLoading,
        contextLabel: "exam.archive",
        onStatusChangeSuccess: list.reloadList,
    });

    const actions = useArchiveTableActions({
        onArchiveExam: archiveFlow.openStatusDialog,
    });

    const selection = useArchiveTableSelection({
        onSelect: notifySelect,
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
            actions,
            selection,
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
            dialogOpen: archiveFlow.statusDialogOpen,
            target: archiveFlow.statusTarget,
            openDialog: archiveFlow.openStatusDialog,
            confirm: archiveFlow.confirmStatusChange,
        }),
    };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function notifySelect(item: TableItem, selected: boolean) {
    // TODO
    // console.info(item);
    // console.info("select: " + selected);
}
