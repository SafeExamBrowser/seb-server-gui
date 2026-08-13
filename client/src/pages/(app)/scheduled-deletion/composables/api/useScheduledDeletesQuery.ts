import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getScheduledDeletesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetScheduledDeletesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getScheduledDeletes } from "@/services/seb-server/scheduledDeletionService.ts";

export const useScheduledDeletesQuery = (
    query: Readonly<Ref<GetScheduledDeletesData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getScheduledDeletesQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getScheduledDeletes(query.value),
        placeholderData: keepPreviousData,
    });
