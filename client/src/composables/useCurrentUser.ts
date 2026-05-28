import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getCurrentUserAccountQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient";
import { getCurrentUserAccount } from "@/services/seb-server/userAccountService";
import { queryClient } from "@/services/http/queryClient";
import { toAppError } from "@/services/errors/toAppError";

export const currentUserQueryKey = () =>
    getCurrentUserAccountQueryKey({ client: heySebServerClient });

export function clearCurrentUser(): void {
    queryClient.removeQueries({ queryKey: currentUserQueryKey() });
}

export function useCurrentUser() {
    const query = useQuery({
        queryKey: currentUserQueryKey(),
        queryFn: ({ signal }) => getCurrentUserAccount({ signal }),
        staleTime: Infinity,
    });

    return {
        user: query.data,
        loading: query.isPending,
        error: computed(() =>
            query.error.value ? toAppError(query.error.value) : undefined,
        ),
        refetch: () => query.refetch(),
    };
}
