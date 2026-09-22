import { computed, ref } from "vue";

import { ScheduledDeleteItem } from "@/models/scheduledDeletion.ts";
import { useDeleteScheduledDeleteMutation } from "@/pages/(app)/scheduled-deletion/composables/api/useDeleteScheduledDeleteMutation.ts";
import { formatTimestampToDate } from "@/utils/timeUtils";

export const useScheduledDeleteDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const { mutateAsync: deleteScheduledDelete, isPending: deleteLoading } =
        useDeleteScheduledDeleteMutation();

    const deleteTarget = ref<ScheduledDeleteItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value
            ? `Scheduled Deletion ${formatTimestampToDate(deleteTarget.value.scheduleTime)}`
            : "",
    );

    const openDeleteDialog = (item: ScheduledDeleteItem) => {
        deleteTarget.value = item;
        deleteDialogOpen.value = true;
    };

    const confirmDelete = async () => {
        const target = deleteTarget.value;
        deleteDialogOpen.value = false;

        if (!target) {
            return;
        }

        try {
            await deleteScheduledDelete(String(target.id));
        } catch {
            return;
        }

        onDeleteSuccess();
    };

    return {
        deleteDialogOpen,
        deleteDetailText,
        deleteLoading,
        openDeleteDialog,
        confirmDelete,
    };
};
