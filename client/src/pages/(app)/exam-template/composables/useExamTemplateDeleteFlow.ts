import { computed, ref } from "vue";
import { useDeleteExamTemplate } from "./api/useDeleteExamTemplate.ts";
import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";

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

        if (!target) {
            deleteDialogOpen.value = false;
            return;
        }

        await deleteTemplate(target.id);
        deleteDialogOpen.value = false;

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
