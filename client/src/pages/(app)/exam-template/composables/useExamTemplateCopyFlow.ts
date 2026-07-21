import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";

import { useCopyExamTemplate } from "./api/useCopyExamTemplate.ts";

export const useExamTemplateCopyFlow = ({
    onCopySuccess,
}: {
    onCopySuccess: () => void;
}) => {
    const {
        mutateData: copyTemplate,
        loading: copyLoading,
        error: copyError,
    } = useCopyExamTemplate();

    const copy = async (item: ExamTemplateTableItem) => {
        await copyTemplate(item.id);

        if (copyError.value !== undefined) {
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
