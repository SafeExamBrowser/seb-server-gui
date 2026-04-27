import { useMutation } from "@/composables/useMutation";
import { createCertificate } from "@/services/seb-server/certificateService";
import type {
    Certificate,
    CreateCertificatePar,
} from "@/models/seb-server/certificate";

export const useCreateCertificate = () =>
    useMutation<[CreateCertificatePar], Certificate>((params) =>
        createCertificate(params),
    );
