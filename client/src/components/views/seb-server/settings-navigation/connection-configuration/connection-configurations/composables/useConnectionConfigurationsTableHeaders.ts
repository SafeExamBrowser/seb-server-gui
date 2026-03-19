import { computed } from "vue";
import { translate } from "@/utils/generalUtils";

export const useConnectionConfigurationsTableHeaders = () =>
    computed(() => [
        {
            title: translate(
                "connectionConfigurations.connectionConfigurationsPage.connectionConfigurationsTableHeaders.tableHeaderInstitution",
            ),
            key: "institutionId",
            width: "20%",
            sortable: true,
        },
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
    ]);
