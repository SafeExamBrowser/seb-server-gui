import { computed, reactive } from "vue";
import { useCertificatesTableHeaders } from "./useCertificateTableHeaders.ts";
import { useCertificatesTableActions } from "./useCertificatesTableActions.ts";
import { useCertificateCreateForm } from "./useCertificateCreateForm.ts";
import { useCertificatesList } from "./useCertificatesList.ts";
import { useDeleteCertificate } from "./api/useDeleteCertificate.ts";
import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";

export const useCertificatesOverview = () => {
    const { headers, cellFormatters } = useCertificatesTableHeaders();

    const list = useCertificatesList();

    const {
        removeCertificateFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteCertificate();

    const deleteFlow = useEntityDeleteFlow({
        remove: removeCertificateFromItem,
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "certificate",
        detailTextOf: (item) => String(item.alias ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const { getEmptyItem, getFormFields, handleUploadCertificate } =
        useCertificateCreateForm({ onSuccess: () => void list.loadItems() });

    const tableLoading = computed(
        () => list.loading.value || deleteFlow.deleteLoading.value,
    );

    const actions = useCertificatesTableActions({
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
            actions,
            searchInputValue: list.searchInputValue,
            searchField: list.searchField,
            onSearch: list.onSearch,
            onClearSearch: list.onClearSearch,
            loadItems: list.loadItems,
        }),
        deleteFlow: reactive({
            dialogOpen: deleteFlow.deleteDialogOpen,
            detailText: deleteFlow.deleteDetailText,
            confirm: deleteFlow.confirmDelete,
        }),
        uploadForm: {
            getEmptyItem,
            getFormFields,
            handleUpload: handleUploadCertificate,
        },
    };
};
