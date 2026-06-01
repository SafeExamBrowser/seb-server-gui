import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useExamTemplateTableHeaders } from "./useExamTemplateTableHeaders.ts";
import { useExamTemplateTableActions } from "./useExamTemplateTableActions.ts";
import { useExamTemplateList } from "./useExamTemplateList.ts";
import { useExamTemplateDeleteFlow } from "./useExamTemplateDeleteFlow.ts";
import { useExamTemplateCopyFlow } from "./useExamTemplateCopyFlow.ts";
import {
    isExamTemplateTableItem,
    type ExamTemplateTableItem,
} from "@/pages/(app)/exam-template/types.ts";

export const useExamTemplateOverview = () => {
    const router = useRouter();

    const createExamTemplateDetailRoute = (
        item: ExamTemplateTableItem,
    ): RouteLocationAsRelative => ({
        name: "/(app)/exam-template/[id]/",
        params: { id: item.id },
    });

    const tableDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null => {
        if (!isExamTemplateTableItem(item)) {
            return null;
        }

        return createExamTemplateDetailRoute(item);
    };

    const { headers, cellFormatters } = useExamTemplateTableHeaders();

    const {
        items,
        pageCount,
        loading,
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
    } = useExamTemplateList();

    const {
        deleteDialogOpen,
        deleteDetailText,
        deleteError,
        deleteLoading,
        openDeleteDialog,
        confirmDelete,
    } = useExamTemplateDeleteFlow({ onDeleteSuccess: reloadList });

    const { copy, copyLoading, copyError } = useExamTemplateCopyFlow({
        onCopySuccess: reloadList,
    });

    const tableLoading = computed(
        () => loading.value || deleteLoading.value || copyLoading.value,
    );

    const actions = useExamTemplateTableActions({
        onEdit: (item) => {
            router.push(createExamTemplateDetailRoute(item));
        },
        onCopy: (item) => {
            copy(item);
        },
        onDelete: openDeleteDialog,
    });

    return {
        list: reactive({
            items,
            pageCount,
            errors,
            options,
            headers,
            cellFormatters,
            loading: tableLoading,
            detailRoute: tableDetailRoute,
            actions,
            searchInputValue,
            searchField,
            selectedFilters,
            filterSections,
            onSearch,
            onClearSearch,
            setFilters,
            clearAll,
            loadItems,
        }),
        deleteFlow: reactive({
            dialogOpen: deleteDialogOpen,
            detailText: deleteDetailText,
            error: deleteError,
            confirm: confirmDelete,
        }),
        copyFlow: reactive({
            error: copyError,
        }),
    };
};
