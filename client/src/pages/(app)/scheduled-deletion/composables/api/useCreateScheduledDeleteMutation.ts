import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { createScheduledDelete } from "@/services/seb-server/scheduledDeletionService";

export const useCreateScheduledDeleteMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { deleteDueTime: number }) =>
            createScheduledDelete(body),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getUserAccountsQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
