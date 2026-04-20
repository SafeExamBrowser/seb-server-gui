import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/blocks/entity-table/types.ts";

export function useCertificatesTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
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
            width: "25%",
            key: "certType",
            sortable: false,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        validityFrom: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        validityTo: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
        certType: (value) => {
            if (!Array.isArray(value) || value.length === 0) return "";
            return value
                .map((type) => translate(`certificates.types.${String(type)}`))
                .join(" | ");
        },
    };

    return { headers, cellFormatters };
}
