import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getUserAccountsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccounts } from "@/services/seb-server/userAccountService.ts";

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
        queryFn: () => getUserAccounts(query.value),
        placeholderData: keepPreviousData,
    });
