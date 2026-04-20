import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/blocks/entity-table/types.ts";

export function useAssessmentToolsTableHeaders() {
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
                    "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderInstitution",
                ),
                key: "institutionId",
                width: "20%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate(
                    "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderName",
                ),
                key: "name",
                width: "20%",
                sortable: true,
            },
            {
                title: translate(
                    "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderAssessmentToolType",
                ),
                key: "lmsType",
                width: "20%",
                sortable: false,
            },
            {
                title: translate(
                    "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderStatus",
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
        lmsType: (value) =>
            value
                ? translate(
                      `assessmentToolConnections.lmsTypes.${String(value)}`,
                  )
                : "",
    };

    return { headers, cellFormatters };
}
