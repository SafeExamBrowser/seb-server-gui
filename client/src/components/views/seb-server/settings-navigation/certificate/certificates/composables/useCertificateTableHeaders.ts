import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes.ts";

export const useCertificatesTableHeaders = () => {
    return computed<SettingsTableHeader[]>(() => {
        const headers: SettingsTableHeader[] = [];
        headers.push(
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
            {
                title: "",
                key: "actions",
                width: "1%",
                sortable: false,
            },
        );
        return headers;
    });
};
