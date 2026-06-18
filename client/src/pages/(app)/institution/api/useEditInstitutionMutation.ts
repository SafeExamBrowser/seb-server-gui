import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
    getInstitutionByIdQueryKey,
    getInstitutionsQueryKey,
} from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { editInstitution } from "@/services/seb-server/institutionService.ts";
import type { InstitutionEditRequest } from "@/models/institution.ts";

export const useEditInstitutionMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: InstitutionEditRequest) => editInstitution(body),
        onSuccess: (institution) => {
            void queryClient.invalidateQueries({
                queryKey: getInstitutionsQueryKey({
                    client: heySebServerClient,
                }),
            });
            queryClient.setQueryData(
                getInstitutionByIdQueryKey({
                    client: heySebServerClient,
                    path: { modelId: String(institution.id) },
                }),
                institution,
            );
        },
    });
};
