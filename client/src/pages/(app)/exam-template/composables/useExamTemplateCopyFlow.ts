import { useCopyExamTemplateMutation } from "@/pages/(app)/exam-template/api/useCopyExamTemplateMutation.ts";
import type { ExamTemplateTableItem } from "@/pages/(app)/exam-template/types.ts";

export const useExamTemplateCopyFlow = ({
    onCopySuccess,
}: {
    onCopySuccess: () => void;
}) => {
    const { mutateAsync: copyTemplate, isPending: copyLoading } =
        useCopyExamTemplateMutation();

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
    };
};
