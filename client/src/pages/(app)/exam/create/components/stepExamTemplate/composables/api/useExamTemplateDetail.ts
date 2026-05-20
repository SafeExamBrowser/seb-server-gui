import { useMutation } from "@/composables/useMutation.ts";
import { getExamTemplate } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateDetail = () => {
    const { data, loading, error, mutateData } = useMutation((id: string) =>
        getExamTemplate(id),
    );

    return {
        data,
        loading,
        error,
        fetch: mutateData,
    };
};
