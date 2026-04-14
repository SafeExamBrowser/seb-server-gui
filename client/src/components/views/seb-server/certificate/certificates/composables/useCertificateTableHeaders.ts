import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { SebTableHeader } from "@/components/views/seb-server/composables/sebServerTableHeaderTypes.ts";

export const useCertificatesTableHeaders = () => {
    return computed<SebTableHeader[]>(() => [
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderAlias",
            ),
            key: "alias",
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderValidFrom",
            ),
            key: "validityFrom",
            width: "20%",
            sortable: false,
            translateType: "dateTime",
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderValidTo",
            ),
            key: "validityTo",
            width: "20%",
            sortable: false,
            translateType: "dateTime",
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderTypes",
            ),
            width: "25%",
            key: "certType",
            sortable: false,
            translateType: "certificateTypes",
        },
    ]);
};
