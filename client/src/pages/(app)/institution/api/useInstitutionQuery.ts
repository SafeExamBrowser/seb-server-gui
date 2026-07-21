import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getInstitutionByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getInstitutionById } from "@/services/seb-server/institutionService.ts";

export const useInstitutionQuery = (modelId: Readonly<Ref<string>>) =>
    useQuery({
        queryKey: computed(() =>
            getInstitutionByIdQueryKey({
                client: heySebServerClient,
                path: { modelId: modelId.value },
            }),
        ),
        queryFn: () => getInstitutionById(modelId.value),
    });
