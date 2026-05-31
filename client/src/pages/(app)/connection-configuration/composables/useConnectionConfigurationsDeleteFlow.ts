import { computed, ref } from "vue";
import { useDeleteConnectionConfiguration } from "@/pages/(app)/connection-configuration/api/useDeleteConnectionConfiguration.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useConnectionConfigurationsDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        removeConnectionConfigurationFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteConnectionConfiguration();

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

        await removeConnectionConfigurationFromItem(target);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
            notify.serverError(deleteError.value, {
                contextLabel: "connectionconfiguration",
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
