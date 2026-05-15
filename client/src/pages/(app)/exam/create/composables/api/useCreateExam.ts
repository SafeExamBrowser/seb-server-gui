import { createExam } from "@/services/seb-server/examService.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { CreateExamPar } from "@/models/seb-server/exam.ts";

export const useCreateExam = () => {
    const { data, loading, error, mutateData } = useMutation(
        (payload: CreateExamPar) => createExam(payload),
    );

    return {
        create: mutateData,
        loading,
        error,
        data,
    };
};
