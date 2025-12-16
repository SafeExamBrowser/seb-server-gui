import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types";

export const getSummaryIndicators = (
    examTemplate: ExamTemplate,
): SummarySectionData => ({
    label: i18n.global.t(
        "createTemplateExam.steps.summary.sections.indicators.title",
    ),
    items: examTemplate.indicatorTemplates.map((indicator) => ({
        type: "collection" as const,
        key: `indicator-${indicator.name}`,
        items: [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.name.label",
                ),
                value: { type: "string", value: indicator.name },
            },
            {
                type: "basic" as const,
                key: "typeDetails",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.type.label",
                ),
                value: {
                    type: "string",
                    value: i18n.global.t(
                        `createTemplateExam.steps.indicators.fields.type.types.${indicator.type}`,
                    ),
                },
            },
            {
                type: "basic" as const,
                key: "thresholds",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.label",
                ),
                value: {
                    type: "thresholds",
                    value: indicator.thresholds,
                },
            },
        ],
    })),
});
