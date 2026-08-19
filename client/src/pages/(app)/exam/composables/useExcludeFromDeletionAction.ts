import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getScheduledDeletesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { TableItem } from "@/components/widgets/entity-table/types.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { setExamExcludedFromDeletion } from "@/services/seb-server/scheduledDeletionService.ts";

export const useExcludeFromDeletionAction = () => {
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

    const toggleExcludeFromDeletion = async (item: TableItem) => {
        try {
            const exam = item as Exam;

            const exclude = !exam.excludeFromDeletion;

            await excludeFromDeletionMutation.mutateAsync({
                id: exam.id,
                exclude,
            });
        } catch {
            return;
        }
    };

    return { toggleExcludeFromDeletion };
};
