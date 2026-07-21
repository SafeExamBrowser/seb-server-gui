import { useRouter } from "vue-router";

import { useMutation } from "@/composables/useMutation.ts";
import * as examService from "@/services/seb-server/examService.ts";

export const useDeleteExamAction = (examId?: number) => {
    const router = useRouter();

    const deleteExamMutation = useMutation((id: number) =>
        examService.deleteExam(String(id)),
    );

    const handleDeleteExam = async () => {
        if (examId === undefined) {
            return;
        }

        await deleteExamMutation.mutateData(examId);

        if (deleteExamMutation.error.value) {
            return;
        }

        await router.push({ name: "/(app)/exam/" });
    };

    return { handleDeleteExam };
};
