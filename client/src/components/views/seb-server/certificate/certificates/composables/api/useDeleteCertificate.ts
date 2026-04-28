import type { Ref } from "vue";
import { ref } from "vue";
import { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import { deleteCertificate } from "@/services/seb-server/certificateService.ts";

export const useDeleteCertificate = (
    certificates: Ref<CertificatesResponse | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const removeCertificate = async (alias: string): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await deleteCertificate(alias);

            if (response === null) {
                throw new Error("Failed to delete certificate");
            }

            if (certificates.value?.content) {
                certificates.value.content = certificates.value.content.filter(
                    (certificate) => certificate.alias !== alias,
                );
            }

            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const removeCertificateFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const alias = item.alias;

        if (typeof alias !== "string") {
            error.value = "Invalid certificate identifier.";
            return false;
        }

        return removeCertificate(alias);
    };

    return {
        removeCertificate,
        removeCertificateFromItem,
        loading,
        error,
    };
};
