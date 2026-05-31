import { ref, type Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

// Generic "toggle a row's active status" dialog flow shared by the settings
// list pages: holds the confirm-dialog state, runs the injected toggle
// mutation, surfaces server errors and notifies success. Entities differ only
// in the mutation and the notify context label.
export const useEntityStatusFlow = (config: {
    toggle: (item: TableItem) => Promise<void>;
    error: Ref<AppError | undefined>;
    loading: Ref<boolean>;
    contextLabel: string;
    onStatusChangeSuccess: () => void;
}) => {
    const statusTarget = ref<TableItem | undefined>(undefined);
    const statusDialogOpen = ref(false);

    const openStatusDialog = (item: TableItem) => {
        statusTarget.value = item;
        statusDialogOpen.value = true;
    };

    const confirmStatusChange = async () => {
        const target = statusTarget.value;

        if (!target) {
            statusDialogOpen.value = false;
            return;
        }

        await config.toggle(target);
        statusDialogOpen.value = false;

        if (config.error.value !== undefined) {
            notify.serverError(config.error.value, {
                contextLabel: config.contextLabel,
            });
            return;
        }

        config.onStatusChangeSuccess();
    };

    return {
        statusDialogOpen,
        statusTarget,
        statusError: config.error,
        statusLoading: config.loading,
        openStatusDialog,
        confirmStatusChange,
    };
};
