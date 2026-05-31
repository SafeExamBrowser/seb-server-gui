import { ref } from "vue";
import { useToggleAssessmentToolStatus } from "@/pages/(app)/assessment-tool/api/useToggleAssessmentTool.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useAssessmentToolsStatusFlow = ({
    onStatusChangeSuccess,
}: {
    onStatusChangeSuccess: () => void;
}) => {
    const {
        toggleAssessmentToolStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleAssessmentToolStatus();

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

        await toggleAssessmentToolStatusFromItem(target);
        statusDialogOpen.value = false;

        if (statusError.value !== undefined) {
            notify.serverError(statusError.value, {
                contextLabel: "assessmenttool.status",
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
