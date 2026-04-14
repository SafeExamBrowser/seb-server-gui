import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { SebTableHeader } from "@/components/views/seb-server/composables/sebServerTableHeaderTypes.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";

export const useAssessmentToolsTableHeaders = () => {
    const showInstitutionColumn = useShowInstitutionColumn();

    return computed<SebTableHeader[]>(() => {
        const headers: SebTableHeader[] = [];

        if (showInstitutionColumn.value) {
            headers.push({
                title: translate(
                    "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderInstitution",
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
                translateType: "assessmentToolType",
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

        return headers;
    });
};
