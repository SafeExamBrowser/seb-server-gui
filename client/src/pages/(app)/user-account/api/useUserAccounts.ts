import { computed, type Ref } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccounts } from "@/services/seb-server/userAccountService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useUserAccounts = (
    query: Readonly<Ref<GetUserAccountsData["query"]>>,
) => {
    const result = useQuery({
        queryKey: computed(() =>
            getUserAccountsQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: ({ signal }) => getUserAccounts(query.value, { signal }),
        placeholderData: keepPreviousData,
    });

    const error = computed(() => toAppErrorOrUndefined(result.error.value));

    return {
        data: result.data,
        isPending: result.isPending,
        isFetching: result.isFetching,
        error,
        refetch: () => result.refetch(),
    };
};
