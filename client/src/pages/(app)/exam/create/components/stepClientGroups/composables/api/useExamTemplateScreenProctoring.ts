import { useMutation } from "@/composables/useMutation.ts";
import { getExamTemplateSp } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateScreenProctoring = () => {
    const { data, loading, error, mutateData } = useMutation((id: string) =>
        getExamTemplateSp(id),
    );

    return {
        data,
        loading,
        error,
        fetch: mutateData,
    };
};
