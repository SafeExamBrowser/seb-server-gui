import { computed, ref, type Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useEntityDeleteFlow = (config: {
    remove: (item: TableItem) => Promise<void>;
    error: Ref<AppError | undefined>;
    loading: Ref<boolean>;
    contextLabel: string;
    detailTextOf: (item: TableItem) => string;
    onDeleteSuccess: () => void;
}) => {
    const deleteTarget = ref<TableItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value ? config.detailTextOf(deleteTarget.value) : "",
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

        await config.remove(target);
        deleteDialogOpen.value = false;

        if (config.error.value !== undefined) {
            notify.serverError(config.error.value, {
                contextLabel: config.contextLabel,
            });
            return;
        }

        config.onDeleteSuccess();
    };

    return {
        deleteDialogOpen,
        deleteDetailText,
        deleteError: config.error,
        deleteLoading: config.loading,
        openDeleteDialog,
        confirmDelete,
    };
};
