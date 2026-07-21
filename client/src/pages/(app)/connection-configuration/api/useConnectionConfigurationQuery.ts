import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getSebClientConfigByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getConnectionConfigurationById } from "@/services/seb-server/connectionConfigurationService.ts";

const disabledConnectionConfigurationQueryKey = [
    "getSebClientConfigById",
    "disabled",
];

export const useConnectionConfigurationQuery = (
    id: Readonly<Ref<string | undefined>>,
) =>
    useQuery({
        queryKey: computed(() =>
            id.value
                ? getSebClientConfigByIdQueryKey({
                      client: heySebServerClient,
                      path: { modelId: id.value },
                  })
                : disabledConnectionConfigurationQueryKey,
        ),
        queryFn: () => {
            if (!id.value) {
                throw new Error("unreachable: enabled guards id");
            }
            return getConnectionConfigurationById(id.value);
        },
        enabled: computed(() => !!id.value),
    });
