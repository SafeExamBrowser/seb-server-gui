import { computed, type Ref } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccounts } from "@/services/seb-server/userAccountService.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useUserAccountsQuery = (
    query: Readonly<Ref<GetUserAccountsData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getUserAccountsQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: ({ signal }) => getUserAccounts(query.value, { signal }),
        placeholderData: keepPreviousData,
    });
