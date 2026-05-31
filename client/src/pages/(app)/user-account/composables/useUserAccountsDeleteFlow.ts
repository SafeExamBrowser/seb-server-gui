import { computed, ref } from "vue";
import { useDeleteUserAccount } from "@/pages/(app)/user-account/api/useDeleteUserAccount.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export const useUserAccountsDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        removeUserAccountFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteUserAccount();

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

        await removeUserAccountFromItem(target);
        deleteDialogOpen.value = false;

        if (deleteError.value !== undefined) {
            notify.serverError(deleteError.value, {
                contextLabel: "useraccount",
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
