import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import { CONNECTION_CONFIGURATION_COLUMN } from "@/pages/(app)/connection-configuration/connectionConfigurationListConfig.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

export function useConnectionConfigurationsTableHeaders() {
    const showInstitutionColumn = useShowInstitutionColumn();
    const { getInstitutionName, fetchInstitutions } = useInstitutionNameMap();

    watch(
        showInstitutionColumn,
        async (show) => {
            if (show) await fetchInstitutions();
        },
        { immediate: true },
    );

    const headers = computed<TableHeader[]>(() => {
        const base: TableHeader[] = [];

        if (showInstitutionColumn.value) {
            base.push({
                title: translate(
                    "connectionConfigurations.list.tableHeaders.institution",
                ),
                key: CONNECTION_CONFIGURATION_COLUMN.institutionId,
                width: "20%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate(
                    "connectionConfigurations.list.tableHeaders.name",
                ),
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
        );

        return base;
    });

    const cellFormatters: Record<string, CellFormatter> = {
        [CONNECTION_CONFIGURATION_COLUMN.institutionId]: (value) =>
            getInstitutionName(value),
        [CONNECTION_CONFIGURATION_COLUMN.date]: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
    };

    return { headers, cellFormatters };
}
