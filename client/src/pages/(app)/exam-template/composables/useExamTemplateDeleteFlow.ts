import { computed, ref } from "vue";
import { useDeleteExamTemplate } from "./api/useDeleteExamTemplate.ts";
import type { ExamTemplateTableItem } from "../types.ts";

export const useExamTemplateDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        mutateData: deleteTemplate,
        loading: deleteLoading,
        error: deleteError,
    } = useDeleteExamTemplate();

    const deleteTarget = ref<ExamTemplateTableItem | undefined>(undefined);
    const deleteDialogOpen = ref(false);

    const deleteDetailText = computed(() =>
        deleteTarget.value ? deleteTarget.value.name : "",
    );

    const openDeleteDialog = (item: ExamTemplateTableItem) => {
        deleteTarget.value = item;
        deleteDialogOpen.value = true;
    };

    const confirmDelete = async () => {
        const target = deleteTarget.value;
        deleteDialogOpen.value = false;

        if (!target) {
            return;
        }

        await deleteTemplate(target.id);

        if (deleteError.value !== undefined) {
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
