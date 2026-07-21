import { type Ref, ref } from "vue";

import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import type { AppError } from "@/services/errors/types.ts";
import { notify } from "@/services/notifications/notify.ts";

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
