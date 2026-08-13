import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getScheduledDeletesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { deleteScheduledDelete } from "@/services/seb-server/scheduledDeletionService.ts";

export const useDeleteScheduledDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (modelId: string) => deleteScheduledDelete(modelId),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getScheduledDeletesQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
