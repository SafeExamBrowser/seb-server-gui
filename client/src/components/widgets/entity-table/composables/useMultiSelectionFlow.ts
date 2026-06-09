import { ref, type Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { TableRowSelect } from "@/components/widgets/entity-table/types.ts";

export const useMultiSelectionFlow = (config: {
    process: (selection: Ref<string[], string[]>) => Promise<void>;
    clearSelection: () => void;
    error: Ref<AppError | undefined>;
    loading: Ref<boolean>;
    contextLabel: string;
    onSuccess: () => void;
}) => {
    const selectionTarget = ref<string[]>([]);
    const selectionDialogOpen = ref(false);

    const openActionDialog = (item: TableRowSelect) => {
        selectionTarget.value = item.selectionModel.value;
        selectionDialogOpen.value = true;
    };

    const confirmAction = async () => {
        if (!selectionTarget.value) {
            selectionDialogOpen.value = false;
            return;
        }

        selectionDialogOpen.value = false;

        config.clearSelection();
        await config.process(selectionTarget);
        if (config.error.value !== undefined) {
            notify.serverError(config.error.value, {
                contextLabel: config.contextLabel,
            });
            return;
        }

        config.onSuccess();
    };

    return {
        selectionDialogOpen,
        selectionTarget,
        statusError: config.error,
        statusLoading: config.loading,
        openActionDialog,
        confirmAction,
    };
};
