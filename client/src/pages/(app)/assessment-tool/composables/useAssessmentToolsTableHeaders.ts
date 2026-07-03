import { computed, watch } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";
import { useInstitutionNameMap } from "@/composables/useInstitutionNameMap.ts";
import { ASSESSMENT_TOOL_COLUMN } from "@/pages/(app)/assessment-tool/assessmentToolListConfig.ts";
import type {
    TableHeader,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";

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
                    "assessmentToolConnections.list.tableHeaders.institution",
                ),
                key: ASSESSMENT_TOOL_COLUMN.institutionId,
                width: "20%",
                sortable: true,
            });
        }

        base.push(
            {
                title: translate(
                    "assessmentToolConnections.list.tableHeaders.name",
                ),
                key: ASSESSMENT_TOOL_COLUMN.name,
                width: "20%",
                sortable: true,
            },
            {
                title: translate(
                    "assessmentToolConnections.list.tableHeaders.type",
                ),
                key: ASSESSMENT_TOOL_COLUMN.lmsType,
                width: "20%",
                sortable: false,
            },
            {
                title: translate(
                    "assessmentToolConnections.list.tableHeaders.status",
                ),
                key: ASSESSMENT_TOOL_COLUMN.active,
                width: "15%",
                sortable: false,
            },
        );

        return base;
    });

    const cellFormatters: Record<string, CellFormatter> = {
        [ASSESSMENT_TOOL_COLUMN.institutionId]: (value) =>
            getInstitutionName(value),
        [ASSESSMENT_TOOL_COLUMN.lmsType]: (value) =>
            value
                ? translate(
                      `assessmentToolConnections.lmsTypes.${String(value)}`,
                  )
                : "",
    };

    return { headers, cellFormatters };
}
