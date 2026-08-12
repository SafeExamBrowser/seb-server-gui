import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getExamTemplatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { GetExamTemplatesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getExamTemplatePage } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplatesQuery = (
    query: Readonly<Ref<GetExamTemplatesData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getExamTemplatesQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getExamTemplatePage(query.value),
        placeholderData: keepPreviousData,
    });
