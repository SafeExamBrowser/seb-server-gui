import { useMutation, useQueryClient } from "@tanstack/vue-query";
import type { Ref } from "vue";

import { getScheduledDeletesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { setExamExcludedFromDeletion } from "@/services/seb-server/scheduledDeletionService.ts";

export const useExcludeFromDeletionAction = (
    exam: Ref<Exam | undefined>,
    examId?: number,
) => {
    const queryClient = useQueryClient();
    const excludeFromDeletionMutation = useMutation({
        mutationFn: ({ id, exclude }: { id: number; exclude: boolean }) =>
            setExamExcludedFromDeletion(id, exclude),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getScheduledDeletesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });

    const handleExcludeFromDeletionToggle = async () => {
        if (examId === undefined || !exam.value) {
            return;
        }

        const exclude = !exam.value.excludeFromDeletion;

        try {
            await excludeFromDeletionMutation.mutateAsync({
                id: examId,
                exclude,
            });
        } catch {
            return;
        }

        exam.value = { ...exam.value, excludeFromDeletion: exclude };
    };

    return { handleExcludeFromDeletionToggle };
};
