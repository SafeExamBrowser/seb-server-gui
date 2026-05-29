import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getUserAccountByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccountById } from "@/services/seb-server/userAccountService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

const disabledUserAccountQueryKey = ["getUserAccountById", "disabled"];

export const useUserAccount = (
    accountId: Readonly<Ref<string | undefined>>,
) => {
    const query = useQuery({
        queryKey: computed(() =>
            accountId.value
                ? getUserAccountByIdQueryKey({
                      client: heySebServerClient,
                      path: { modelId: accountId.value },
                  })
                : disabledUserAccountQueryKey,
        ),
        queryFn: ({ signal }) => {
            if (!accountId.value) {
                throw new Error("unreachable: enabled guards accountId");
            }
            return getUserAccountById(accountId.value, { signal });
        },
        enabled: computed(() => !!accountId.value),
    });

    const error = computed(() => toAppErrorOrUndefined(query.error.value));

    return {
        data: query.data,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error,
        refetch: () => query.refetch(),
    };
};
