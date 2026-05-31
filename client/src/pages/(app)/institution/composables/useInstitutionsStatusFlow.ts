import { ref } from "vue";
import { useToggleInstitutionStatus } from "@/pages/(app)/institution/api/useToggleInstitutionStatus.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useInstitutionsStatusFlow = ({
    onStatusChangeSuccess,
}: {
    onStatusChangeSuccess: () => void;
}) => {
    const {
        toggleInstitutionStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleInstitutionStatus();

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

        await toggleInstitutionStatusFromItem(target);
        statusDialogOpen.value = false;

        if (statusError.value !== undefined) {
            notify.serverError(statusError.value, {
                contextLabel: "institution.status",
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
