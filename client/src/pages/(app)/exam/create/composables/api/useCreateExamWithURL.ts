import { createExamWithURL } from "@/services/seb-server/examService.ts";
import { useMutation } from "@/composables/useMutation.ts";
import {
    CreateExamResult,
    CreateExamWithURLPar,
    Exam,
} from "@/models/seb-server/exam.ts";
import { APIMessage } from "@/models/seb-server/apiMessages.ts";

// The `/api/exam` POST returns one of two shapes:
// - 200 OK   → `Exam` object with `id`
// - 206 Partial → `APIMessage[]` where messages[0].details holds the new exam
//   id. This happens when the exam row is created but a post-creation
//   step (e.g. linking the configuration template) fails — the exam still
//   exists and the user should be navigated to it.
export const useCreateExamWithURL = () => {
    const { data, loading, error, mutateData } = useMutation(
        async (payload: CreateExamWithURLPar): Promise<CreateExamResult> => {
            const response = (await createExamWithURL(payload)) as
                | Exam
                | APIMessage[];

            if (Array.isArray(response)) {
                const examId = response[0]?.details;
                if (!examId) {
                    throw new Error(
                        "Exam creation returned a partial response with no exam id",
                    );
                }
                return { examId, partialMessages: response };
            }

            return { examId: String(response.id) };
        },
    );

    return {
        createWithURL: mutateData,
        loading,
        error,
        data,
    };
};
