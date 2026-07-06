import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import { CERTIFICATE_COLUMN } from "@/pages/(app)/certificate/certificateListConfig.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

export function useCertificatesTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderAlias",
            ),
            key: CERTIFICATE_COLUMN.alias,
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderValidFrom",
            ),
            key: CERTIFICATE_COLUMN.validityFrom,
            width: "20%",
            sortable: false,
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderValidTo",
            ),
            key: CERTIFICATE_COLUMN.validityTo,
            width: "20%",
            sortable: false,
        },
        {
            title: translate(
                "certificates.certificateTableHeaders.tableHeaderTypes",
            ),
            width: "25%",
            key: CERTIFICATE_COLUMN.certType,
            sortable: false,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        [CERTIFICATE_COLUMN.validityFrom]: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        [CERTIFICATE_COLUMN.validityTo]: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        [CERTIFICATE_COLUMN.certType]: (value) => {
            if (!Array.isArray(value) || value.length === 0) return "";
            return value
                .map((type) => translate(`certificates.types.${String(type)}`))
                .join(" | ");
        },
    };

    return { headers, cellFormatters };
}
