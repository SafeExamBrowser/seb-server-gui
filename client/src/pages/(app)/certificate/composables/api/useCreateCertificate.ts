import { useMutation } from "@/composables/useMutation.ts";
import { createCertificate } from "@/services/seb-server/certificateService.ts";
import type {
    Certificate,
    CreateCertificatePar,
} from "@/models/seb-server/certificate.ts";

export const useCreateCertificate = () =>
    useMutation<[CreateCertificatePar], Certificate>((params) =>
        createCertificate(params),
    );
