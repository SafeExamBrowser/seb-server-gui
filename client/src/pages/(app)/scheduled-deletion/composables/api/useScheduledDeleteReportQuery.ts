import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getScheduledDeleteReportQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getScheduledDeleteReport } from "@/services/seb-server/scheduledDeletionService.ts";

export const useScheduledDeleteReportQuery = (modelId: Readonly<Ref<string>>) =>
    useQuery({
        queryKey: computed(() =>
            getScheduledDeleteReportQueryKey({
                client: heySebServerClient,
                path: { modelId: modelId.value },
            }),
        ),
        queryFn: () => getScheduledDeleteReport(modelId.value),
    });
