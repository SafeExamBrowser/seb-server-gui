import { ref } from "vue";
import { useToggleConnectionConfigurationStatus } from "@/pages/(app)/connection-configuration/api/useToggleConnectionConfigurationStatus.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useConnectionConfigurationsStatusFlow = ({
    onStatusChangeSuccess,
}: {
    onStatusChangeSuccess: () => void;
}) => {
    const {
        toggleConnectionConfigurationStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleConnectionConfigurationStatus();

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

        await toggleConnectionConfigurationStatusFromItem(target);
        statusDialogOpen.value = false;

        if (statusError.value !== undefined) {
            notify.serverError(statusError.value, {
                contextLabel: "connectionconfiguration.status",
            });
            return;
        }

        onStatusChangeSuccess();
    };

    return {
        statusDialogOpen,
        statusTarget,
        statusError,
        statusLoading,
        openStatusDialog,
        confirmStatusChange,
    };
};
