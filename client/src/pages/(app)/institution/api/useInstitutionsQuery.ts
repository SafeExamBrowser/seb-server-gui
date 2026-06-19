import { computed, type Ref } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getInstitutionsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getInstitutions } from "@/services/seb-server/institutionService.ts";
import type { GetInstitutionsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useInstitutionsQuery = (
    query: Readonly<Ref<GetInstitutionsData["query"]>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getInstitutionsQueryKey({
                client: heySebServerClient,
                query: query.value,
            }),
        ),
        queryFn: () => getInstitutions(query.value),
        placeholderData: keepPreviousData,
    });
