import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getCertificatesQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { importCertificate } from "@/services/seb-server/certificateService.ts";
import type { CertificateImportRequest } from "@/models/certificate.ts";

export const useImportCertificateMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: CertificateImportRequest) =>
            importCertificate(request),
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: getCertificatesQueryKey({
                    client: heySebServerClient,
                }),
            }),
    });
};
