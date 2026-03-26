import * as tableUtils from "@/utils/table/tableUtils";
import { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import { getCertificates } from "@/services/seb-server/certificateService.ts";
import { ref } from "vue";
import type { ServerTablePaging } from "@/models/types.ts";

export const useCertificates = () => {
    const data = ref<CertificatesResponse>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchCertificates = async (
        paging: ServerTablePaging,
        searchField: string | null,
    ) => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await getCertificates(
                tableUtils.assignCertificateSelectPagingOptions(
                    paging,
                    searchField,
                ),
            );

            if (!response) {
                throw new Error("Failed to fetch certificates");
            }

            data.value = response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        fetchCertificates,
    };
};
