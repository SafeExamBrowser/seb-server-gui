import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getScheduledDeletesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { createScheduledDelete } from "@/services/seb-server/scheduledDeletionService.ts";

export const useCreateScheduledDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { deleteDueTime: number }) =>
            createScheduledDelete(body.deleteDueTime),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getScheduledDeletesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
