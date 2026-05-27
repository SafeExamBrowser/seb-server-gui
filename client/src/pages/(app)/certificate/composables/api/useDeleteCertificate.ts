import { useMutation } from "@/composables/useMutation.ts";
import { deleteCertificate } from "@/services/seb-server/certificateService.ts";

export const useDeleteCertificate = () => {
    const {
        mutateData: removeCertificate,
        error,
        loading,
    } = useMutation(async (alias: string) => {
        const response = await deleteCertificate(alias);

        if (response === null) {
            throw new Error("Failed to delete certificate.");
        }
    });

    const removeCertificateFromItem = async (item: Record<string, unknown>) => {
        const alias = item.alias;

        if (typeof alias !== "string") {
            throw new Error(
                "useDeleteCertificate: row item is missing a string alias",
            );
        }

        await removeCertificate(alias);
    };

    return {
        removeCertificate,
        removeCertificateFromItem,
        error,
        loading,
    };
};
