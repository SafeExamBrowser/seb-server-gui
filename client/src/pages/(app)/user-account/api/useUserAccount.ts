import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";
import { getUserAccountByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccountById } from "@/services/seb-server/userAccountService.ts";
import { toAppError } from "@/services/errors/toAppError.ts";

export const useUserAccount = (
    accountId: Readonly<Ref<string | undefined>>,
) => {
    const query = useQuery({
        queryKey: computed(() =>
            getUserAccountByIdQueryKey({
                client: heySebServerClient,
                path: { modelId: accountId.value ?? "" },
            }),
        ),
        queryFn: ({ signal }) =>
            getUserAccountById(accountId.value ?? "", { signal }),
        enabled: computed(() => !!accountId.value),
    });

    const error = computed(() => {
        const err = query.error.value;
        if (!err || axios.isCancel(err)) {
            return undefined;
        }
        return toAppError(err);
    });

    return {
        data: query.data,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error,
        refetch: () => query.refetch(),
    };
};
