import { z } from "zod";

import type { ApiMessage } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { zApiMessage } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { CreateExamPar } from "@/models/seb-server/exam.ts";
import { createExam } from "@/services/seb-server/examService.ts";

export type CreateExamResult = {
    examId: string;
    partialMessages?: ApiMessage[];
};

const zPartialMessages = z.array(zApiMessage);

// The `/api/exam` POST returns one of two shapes:
// - 200 OK   → `Exam` object with `id`
// - 206 Partial → `ApiMessage[]` where messages[0].details holds the new exam
//   id. This happens when the exam row is created but a post-creation
//   step (e.g. linking the configuration template) fails — the exam still
//   exists and the user should be navigated to it.
export const useCreateExam = () => {
    const { data, loading, error, mutateData } = useMutation(
        async (payload: CreateExamPar): Promise<CreateExamResult> => {
            const response = await createExam(payload);

            const partial = zPartialMessages.safeParse(response);
            if (partial.success) {
                const examId = partial.data[0]?.details;
                if (!examId) {
                    throw new Error(
                        "Exam creation returned a partial response with no exam id",
                    );
                }
                return { examId, partialMessages: partial.data };
            }

            return { examId: String(response.id) };
        },
    );

    return {
        create: mutateData,
        loading,
        error,
        data,
    };
};
