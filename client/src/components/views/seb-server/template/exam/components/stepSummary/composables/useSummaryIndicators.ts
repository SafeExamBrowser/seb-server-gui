import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

export const useSummaryIndicators = (
    examTemplate: ExamTemplate,
): SummarySectionData => ({
    label: i18n.global.t(
        "createTemplateExam.steps.summary.sections.indicators.title",
    ),
    items: examTemplate.indicatorTemplates.map((indicator) => ({
        type: "collection",
        key: `indicator-${indicator.name}`,
        items: [
            {
                type: "basic",
                key: "name",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.name.label",
                ),
                value: indicator.name,
            },
            {
                type: "basic",
                key: "typeDetails",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.type.label",
                ),
                value: indicator.type, // TODO @alain: translate type
            },
            {
                type: "basic",
                key: "thresholds",
                label: i18n.global.t(
                    "createTemplateExam.steps.indicators.fields.thresholds.label",
                ),
                value: indicator.thresholds
                    .map(
                        (threshold) =>
                            `${threshold.value} (#${threshold.color})`,
                    )
                    .join(" | "), // TODO @alain: colored thresholds
            },
        ],
    })),
});
