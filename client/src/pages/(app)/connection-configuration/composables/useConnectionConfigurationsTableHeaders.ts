import { computed } from "vue";

import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types.ts";
import { CONNECTION_CONFIGURATION_COLUMN } from "@/pages/(app)/connection-configuration/connectionConfigurationListConfig.ts";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

export function useConnectionConfigurationsTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
        {
            title: translate("connectionConfigurations.list.tableHeaders.name"),
            key: CONNECTION_CONFIGURATION_COLUMN.name,
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "connectionConfigurations.list.tableHeaders.creationDate",
            ),
            key: CONNECTION_CONFIGURATION_COLUMN.date,
            width: "20%",
            sortable: true,
        },
        {
            title: translate(
                "connectionConfigurations.list.tableHeaders.status",
            ),
            key: CONNECTION_CONFIGURATION_COLUMN.active,
            width: "15%",
            sortable: false,
        },
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        [CONNECTION_CONFIGURATION_COLUMN.date]: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
    };

    return { headers, cellFormatters };
}
