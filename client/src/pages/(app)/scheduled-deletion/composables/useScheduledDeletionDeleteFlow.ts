import { computed, ref } from "vue";
import { useDeleteScheduledDeletion } from "./api/useDeleteScheduledDeletion";
import { ScheduledDeleteItem } from "@/models/seb-server/sheduled-deletion";

export const useScheduledDeleteDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        mutateData: deleteTemplate,
        loading: deleteLoading,
        error: deleteError,
    } = useDeleteScheduledDeletion();

    const deleteTarget = ref<ScheduledDeleteItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value ? deleteTarget.value.state : "",
    );

    const openDeleteDialog = (item: ScheduledDeleteItem) => {
        deleteTarget.value = item;
        deleteDialogOpen.value = true;
    };

    const confirmDelete = async () => {
        const target = deleteTarget.value;

        if (!target) {
            deleteDialogOpen.value = false;
            return;
        }

        await deleteTemplate(target.id);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
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
