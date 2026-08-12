import { computed } from "vue";

import { useCopyExamTemplateMutation } from "@/pages/(app)/exam-template/api/useCopyExamTemplateMutation.ts";
import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

export const useExamTemplateCopyFlow = ({
    onCopySuccess,
}: {
    onCopySuccess: () => void;
}) => {
    const {
        mutateAsync: copyTemplate,
        error: copyMutationError,
        isPending: copyLoading,
    } = useCopyExamTemplateMutation();

    const copyError = computed(() =>
        toAppErrorOrUndefined(copyMutationError.value),
    );

    const copy = async (item: ExamTemplateTableItem) => {
        try {
            await copyTemplate(String(item.id));
        } catch {
            return;
        }

        onCopySuccess();
    };

    return {
        copy,
        copyLoading,
        copyError,
    };
};
