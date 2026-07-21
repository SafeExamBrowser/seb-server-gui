import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getSebClientConfigsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetSebClientConfigsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getConnectionConfigurations } from "@/services/seb-server/connectionConfigurationService.ts";

export const useConnectionConfigurationsQuery = (
    query: Readonly<Ref<GetSebClientConfigsData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getSebClientConfigsQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getConnectionConfigurations(query.value),
        placeholderData: keepPreviousData,
    });
