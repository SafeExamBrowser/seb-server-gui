import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { SebTableHeader } from "@/components/views/seb-server/composables/sebServerTableHeaderTypes.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";

export const useConnectionConfigurationsTableHeaders = () => {
    const showInstitutionColumn = useShowInstitutionColumn();

    return computed<SebTableHeader[]>(() => {
        const headers: SebTableHeader[] = [];

        if (showInstitutionColumn.value) {
            headers.push({
                title: translate(
                    "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderInstitution",
                ),
                key: "institutionId",
                width: "20%",
                sortable: true,
                translateType: "institutionName",
            });
        }

        headers.push(
            {
                title: translate(
                    "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderName",
                ),
                key: "name",
                width: "20%",
                sortable: true,
            },
            {
                title: translate(
                    "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderCreationDate",
                ),
                key: "date",
                width: "20%",
                sortable: true,
                translateType: "dateTime",
            },
            {
                title: translate(
                    "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderStatus",
                ),
                key: "active",
                width: "15%",
                sortable: false,
            },
        );

        return headers;
    });
};
