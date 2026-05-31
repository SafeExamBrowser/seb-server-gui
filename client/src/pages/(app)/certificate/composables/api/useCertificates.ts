import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import { getCertificates } from "@/services/seb-server/certificateService.ts";
import type { ServerTablePaging } from "@/models/types.ts";

export const useCertificates = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | undefined>>,
) => {
    return useFetch<CertificatesResponse>(() =>
        getCertificates(
            tableUtils.assignCertificateSelectPagingOptions(
                paging.value,
                searchField.value,
            ),
        ),
    );
};
