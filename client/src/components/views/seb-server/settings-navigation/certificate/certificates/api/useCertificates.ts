import { useFetch } from "@/composables/useFetch";
import * as tableUtils from "@/utils/table/tableUtils";
import { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import { getCertificates } from "@/services/seb-server/certificateService.ts";

export const useCertificates = () =>
    useFetch<CertificatesResponse>(() =>
        getCertificates(
            tableUtils.assignCertificateSelectPagingOptions(
                {
                    page: 1,
                    itemsPerPage: 5,
                    sortBy: [{ key: "name", order: "asc" }],
                },
                null,
            ),
        ),
    );
