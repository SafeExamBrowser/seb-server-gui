import { useMutation, useQueryClient } from "@tanstack/vue-query";

import { getCertificatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import type { EntityKey } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import type { AppError } from "@/services/errors/types.ts";
import { deleteCertificate } from "@/services/seb-server/certificateService.ts";

export const useDeleteCertificateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<EntityKey[], AppError | Error, string>({
        mutationFn: (alias: string) => deleteCertificate(alias),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getCertificatesQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
