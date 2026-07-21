import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getInstitutionsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { InstitutionCreateRequest } from "@/models/institution.ts";
import { createInstitution } from "@/services/seb-server/institutionService.ts";

export const useCreateInstitutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: InstitutionCreateRequest) => createInstitution(body),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: getInstitutionsQueryKey({
                    client: heySebServerClient,
                }),
            });
        },
    });
};
