import { computed } from "vue";
import { translate } from "@/utils/generalUtils";

export const useAssessmentToolTableHeaders = () =>
    computed(() => [
        {
            title: translate(
                "assessmentToolConnections.assessmentToolsPage.assessmentToolTableHeaders.tableHeaderInstitution",
            ),
            key: "institutionId",
            width: "20%",
            sortable: true,
        },
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
            key: "assessmentToolType",
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
        {
            title: "",
            key: "actions",
            width: "1%",
            sortable: false,
        },
    ]);
