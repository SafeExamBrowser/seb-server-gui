import { ref } from "vue";
import { useToggleUserAccountStatus } from "@/pages/(app)/user-account/api/useToggleUserAccountStatus.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useUserAccountsStatusFlow = ({
    onStatusChangeSuccess,
}: {
    onStatusChangeSuccess: () => void;
}) => {
    const {
        toggleUserAccountStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleUserAccountStatus();

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

        await toggleUserAccountStatusFromItem(target);
        statusDialogOpen.value = false;

        if (statusError.value !== undefined) {
            notify.serverError(statusError.value, {
                contextLabel: "useraccount.status",
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
