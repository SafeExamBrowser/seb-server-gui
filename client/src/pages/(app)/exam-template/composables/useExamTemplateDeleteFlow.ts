import { computed, ref } from "vue";

import { useDeleteExamTemplateMutation } from "@/pages/(app)/exam-template/api/useDeleteExamTemplateMutation.ts";
import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

export const useExamTemplateDeleteFlow = ({
    onDeleteSuccess,
}: {
    onDeleteSuccess: () => void;
}) => {
    const {
        mutateAsync: deleteTemplate,
        error: deleteMutationError,
        isPending: deleteLoading,
    } = useDeleteExamTemplateMutation();

    const deleteError = computed(() =>
        toAppErrorOrUndefined(deleteMutationError.value),
    );

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

        try {
            await deleteTemplate(String(target.id));
        } catch {
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
