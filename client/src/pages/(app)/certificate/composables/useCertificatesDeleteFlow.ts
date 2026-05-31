import { computed, ref } from "vue";
import { useDeleteCertificate } from "./api/useDeleteCertificate.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useCertificatesDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        removeCertificateFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteCertificate();

    const deleteTarget = ref<TableItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value ? String(deleteTarget.value.alias ?? "") : "",
    );

    const openDeleteDialog = (item: TableItem) => {
        deleteTarget.value = item;
        deleteDialogOpen.value = true;
    };

    const confirmDelete = async () => {
        const target = deleteTarget.value;

        if (!target) {
            deleteDialogOpen.value = false;
            return;
        }

        await removeCertificateFromItem(target);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
            notify.serverError(deleteError.value, {
                contextLabel: "certificate",
            });
            return;
        }

        onDeleteSuccess();
    };

    return {
        deleteDialogOpen,
        deleteDetailText,
        deleteError,
        deleteLoading,
        openDeleteDialog,
        confirmDelete,
    };
};
