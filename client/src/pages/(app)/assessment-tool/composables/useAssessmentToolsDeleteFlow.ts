import { computed, ref } from "vue";
import { useDeleteAssessmentTool } from "@/pages/(app)/assessment-tool/api/useDeleteAssessmentTool.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useAssessmentToolsDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        removeAssessmentToolFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteAssessmentTool();

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

        await removeAssessmentToolFromItem(target);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
            notify.serverError(deleteError.value, {
                contextLabel: "assessmenttool",
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
