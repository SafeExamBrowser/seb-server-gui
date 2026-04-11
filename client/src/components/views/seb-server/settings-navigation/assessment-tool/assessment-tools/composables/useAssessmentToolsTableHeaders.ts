import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";
import { useShowInstitutionColumn } from "@/composables/useShowInstitutionColumn.ts";

export const useAssessmentToolsTableHeaders = () => {
    const showInstitutionColumn = useShowInstitutionColumn();

    return computed<SettingsTableHeader[]>(() => {
        const headers: SettingsTableHeader[] = [];

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
