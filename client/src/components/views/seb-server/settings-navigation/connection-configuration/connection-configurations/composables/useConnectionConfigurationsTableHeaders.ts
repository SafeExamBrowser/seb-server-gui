import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";
import { useShowInstitutionColumn } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useShowInstitutionColumn.ts";

export const useConnectionConfigurationsTableHeaders = () => {
    const showInstitutionColumn = useShowInstitutionColumn();

    return computed<SettingsTableHeader[]>(() => {
        const headers: SettingsTableHeader[] = [];

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
