import { queryOptions, useQuery } from "@tanstack/vue-query";
import { getCurrentUserAccountQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient";
import { getCurrentUserAccount } from "@/services/seb-server/userAccountService";
import { queryClient } from "@/services/http/queryClient";

export const currentUserQueryOptions = () =>
    queryOptions({
        queryKey: getCurrentUserAccountQueryKey({
            client: heySebServerClient,
        }),
        queryFn: ({ signal }) => getCurrentUserAccount({ signal }),
    });

export const useCurrentUserQuery = () => useQuery(currentUserQueryOptions());

export function clearCurrentUser(): void {
    queryClient.removeQueries({
        queryKey: currentUserQueryOptions().queryKey,
    });
}
