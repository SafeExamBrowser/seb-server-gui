import { computed } from "vue";

import type {
    CellFormatter,
    TableHeader,
} from "@/components/widgets/entity-table/types.ts";
import { ASSESSMENT_TOOL_COLUMN } from "@/pages/(app)/assessment-tool/assessmentToolListConfig.ts";
import { translate } from "@/utils/generalUtils.ts";

export function useAssessmentToolsTableHeaders() {
    const headers = computed<TableHeader[]>(() => [
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
    ]);

    const cellFormatters: Record<string, CellFormatter> = {
        [ASSESSMENT_TOOL_COLUMN.lmsType]: (value) =>
            value
                ? translate(
                      `assessmentToolConnections.lmsTypes.${String(value)}`,
                  )
                : "",
    };

    return { headers, cellFormatters };
}
