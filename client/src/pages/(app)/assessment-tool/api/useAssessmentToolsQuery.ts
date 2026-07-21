import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getLmsSetupsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetLmsSetupsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getAssessmentTools } from "@/services/seb-server/assessmentToolService.ts";

export const useAssessmentToolsQuery = (
    query: Readonly<Ref<GetLmsSetupsData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getLmsSetupsQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getAssessmentTools(query.value),
        placeholderData: keepPreviousData,
    });
