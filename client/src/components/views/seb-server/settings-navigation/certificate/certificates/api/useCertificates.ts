import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import * as tableUtils from "@/utils/table/tableUtils";
import { CertificatesResponse } from "@/models/seb-server/certificate";
import { getCertificates } from "@/services/seb-server/certificateService";
import type { ServerTablePaging } from "@/models/types";

export const useCertificates = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | null>>,
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
