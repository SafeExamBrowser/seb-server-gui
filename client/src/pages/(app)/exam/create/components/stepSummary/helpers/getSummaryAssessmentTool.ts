import i18n from "@/i18n";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { AssessmentTool } from "@/models/seb-server/assessmentTool.ts";

export const getSummaryAssessmentTool = (
    selectedAssessmentToolId: number | undefined,
    assessmentTools: AssessmentTool[],
): SummarySectionData => {
    const tool = assessmentTools.find(
        (candidate) => candidate.id === selectedAssessmentToolId,
    );

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.assessmentTool.title",
        ),
        items: [
            {
                type: "basic" as const,
                key: "assessmentTool",
                label: i18n.global.t(
                    "createExam.steps.assessmentTool.fields.tool.label",
                ),
                value: {
                    type: "string",
                    value:
                        tool?.name ??
                        i18n.global.t("createExam.steps.summary.notFoundValue"),
                },
            },
        ],
    };
};
