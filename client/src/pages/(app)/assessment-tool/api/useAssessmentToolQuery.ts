import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getLmsSetupByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getAssessmentToolById } from "@/services/seb-server/assessmentToolService.ts";

const disabledAssessmentToolQueryKey = ["getLmsSetupById", "disabled"];

export const useAssessmentToolQuery = (id: Readonly<Ref<string | undefined>>) =>
    useQuery({
        queryKey: computed(() =>
            id.value
                ? getLmsSetupByIdQueryKey({
                      client: heySebServerClient,
                      path: { modelId: id.value },
                  })
                : disabledAssessmentToolQueryKey,
        ),
        queryFn: () => {
            if (!id.value) {
                throw new Error("unreachable: enabled guards id");
            }
            return getAssessmentToolById(id.value);
        },
        enabled: computed(() => !!id.value),
    });
