import { useCopyExamTemplate } from "./api/useCopyExamTemplate.ts";
import type { ExamTemplateTableItem } from "../types.ts";

export const useExamTemplateCopyFlow = ({
    reloadList,
}: {
    reloadList: () => Promise<void>;
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

        await reloadList();
    };

    return {
        copy,
        copyLoading,
        copyError,
    };
};
