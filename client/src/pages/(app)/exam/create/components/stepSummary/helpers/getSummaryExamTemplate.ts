import i18n from "@/i18n";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";

export const getSummaryExamTemplate = (
    examTemplate: ExamTemplate | undefined,
): SummarySectionData => {
    const emptyValue = i18n.global.t("createExam.steps.summary.emptyValue");

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.examTemplate.title",
        ),
        items: [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.examTemplate.fields.name.label",
                ),
                value: {
                    type: "string",
                    value: examTemplate?.name ?? emptyValue,
                },
            },
            {
                type: "basic" as const,
                key: "description",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.examTemplate.fields.description.label",
                ),
                value: {
                    type: "string",
                    value: examTemplate?.description || emptyValue,
                },
            },
        ],
    };
};
