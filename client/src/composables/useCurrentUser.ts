import { computed, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getCurrentUserAccountQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient";
import { getCurrentUserAccount } from "@/services/seb-server/userAccountService";
import { queryClient } from "@/services/http/queryClient";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError";
import type { UserAccount } from "@/models/userAccount";

export const currentUserQueryKey = () =>
    getCurrentUserAccountQueryKey({ client: heySebServerClient });

const currentUser = ref<UserAccount>();

const syncCurrentUserFromCache = () => {
    const cached = queryClient.getQueryData<UserAccount>(currentUserQueryKey());
    if (currentUser.value !== cached) {
        currentUser.value = cached;
    }
};

syncCurrentUserFromCache();
queryClient.getQueryCache().subscribe(syncCurrentUserFromCache);

export function clearCurrentUser(): void {
    queryClient.removeQueries({ queryKey: currentUserQueryKey() });
}

export function getCurrentUser(): UserAccount | undefined {
    return currentUser.value;
}

export function useCurrentUser() {
    const query = useQuery({
        queryKey: currentUserQueryKey(),
        queryFn: ({ signal }) => getCurrentUserAccount({ signal }),
        staleTime: Infinity,
    });

    return {
        data: query.data,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: computed(() => toAppErrorOrUndefined(query.error.value)),
        refetch: () => query.refetch(),
    };
}
