import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
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
                key: "institutionId",
                width: "20%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate(
                    "connectionConfigurations.list.tableHeaders.name",
                ),
                key: "name",
                width: "20%",
                sortable: true,
            },
            {
                title: translate(
                    "connectionConfigurations.list.tableHeaders.creationDate",
                ),
                key: "date",
                width: "20%",
                sortable: true,
            },
            {
                title: translate(
                    "connectionConfigurations.list.tableHeaders.status",
                ),
                key: "active",
                width: "15%",
                sortable: false,
            },
        );

        return base;
    });

    const cellFormatters: Record<string, CellFormatter> = {
        institutionId: (value) => getInstitutionName(value),
        date: (value) =>
            value ? formatIsoToReadableDateTime(String(value)) : "",
    };

    return { headers, cellFormatters };
}
