import { computed, ref } from "vue";
import { useDeleteInstitution } from "@/pages/(app)/institution/api/useDeleteInstitution.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useInstitutionsDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        removeInstitutionFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteInstitution();

    const deleteTarget = ref<TableItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value ? String(deleteTarget.value.name ?? "") : "",
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

        await removeInstitutionFromItem(target);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
            notify.serverError(deleteError.value, {
                contextLabel: "institution",
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
