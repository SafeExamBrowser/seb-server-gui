import { useQuery } from "@tanstack/vue-query";
import { computed, type Ref } from "vue";

import { getExamTemplateByIdQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getExamTemplateById } from "@/services/seb-server/examTemplateService.ts";

export const useExamTemplateQuery = (
    modelId: Readonly<Ref<string | undefined>>,
) =>
    useQuery({
        queryKey: computed(() =>
            getExamTemplateByIdQueryKey({
                client: heySebServerClient,
                path: { modelId: modelId.value ?? "" },
            }),
        ),
        queryFn: () => {
            const id = modelId.value;
            if (id === undefined) {
                throw new Error("Exam template id is missing");
            }
            return getExamTemplateById(id);
        },
        enabled: computed(() => modelId.value !== undefined),
    });
