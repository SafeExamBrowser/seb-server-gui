import type { Ref } from "vue";

import { useMutation } from "@/composables/useMutation.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { excludeFromDeletion } from "@/services/seb-server/scheduledDeletionService.ts";

export const useExcludeFromDeletionAction = (
    exam: Ref<Exam | undefined>,
    examId?: number,
) => {
    const excludeFromDeletionMutation = useMutation(
        (id: number, exclude: boolean) => excludeFromDeletion(id, exclude),
    );

    const handleExcludeFromDeletionToggle = async () => {
        if (examId === undefined || !exam.value) {
            return;
        }

        const exclude = !exam.value.excludeFromDeletion;
        await excludeFromDeletionMutation.mutateData(examId, exclude);

        if (excludeFromDeletionMutation.error.value) {
            return;
        }

        exam.value = { ...exam.value, excludeFromDeletion: exclude };
    };

    return { handleExcludeFromDeletionToggle };
};
