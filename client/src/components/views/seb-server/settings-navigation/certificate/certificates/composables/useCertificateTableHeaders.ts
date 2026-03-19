import { computed } from "vue";
import { translate } from "@/utils/generalUtils";

export const useCertificatesTableHeaders = () =>
    computed(() => [
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
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderValidTo",
            ),
            key: "validityTo",
            width: "20%",
            sortable: false,
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderTypes",
            ),
            key: "certType",
            width: "15%",
            sortable: false,
        },
        {
            title: "",
            key: "actions",
            width: "1%",
            sortable: false,
        },
    ]);
