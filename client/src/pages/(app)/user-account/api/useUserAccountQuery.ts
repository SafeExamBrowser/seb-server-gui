import { computed, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getUserAccountByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getUserAccountById } from "@/services/seb-server/userAccountService.ts";

const disabledUserAccountQueryKey = ["getUserAccountById", "disabled"];

export const useUserAccountQuery = (
    accountId: Readonly<Ref<string | undefined>>,
) =>
    useQuery({
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
