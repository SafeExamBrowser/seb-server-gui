import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

const emptyValue = "–" as const;

export const useSummaryNaming = (
    examTemplate: ExamTemplate,
): SummarySectionData => {
    return {
        label: i18n.global.t(
            "createTemplateExam.steps.summary.sections.naming.title",
        ),
        items: [
            {
                type: "basic",
                key: "name",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.name.label",
                ),
                value: examTemplate.name,
            },
            {
                type: "basic",
                key: "description",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.description.label",
                ),
                value: examTemplate.description ?? emptyValue,
            },
            {
                type: "basic",
                key: "examType",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.examType.label",
                ),
                value: examTemplate.examType ?? emptyValue, // TODO @alain: translate type
            },
            {
                type: "basic",
                key: "clientConfiguration",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.clientConfiguration.label",
                ),
                value: examTemplate.clientConfigurationId
                    ? `${examTemplate.clientConfigurationId}` // TODO @alain: show name instead of id
                    : emptyValue,
            },
            {
                type: "basic",
                key: "configurationTemplate",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.configurationTemplate.label",
                ),
                value: examTemplate.configurationTemplateId
                    ? `${examTemplate.configurationTemplateId}` // TODO @alain: show name instead of id
                    : emptyValue,
            },
            {
                type: "basic",
                key: "lmsIntegration",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.lmsIntegration.label",
                ),
                value: examTemplate.lmsIntegration ? "Yes" : "No", // TODO @alain: bool?
            },
            {
                type: "basic",
                key: "institutionalDefault",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.institutionalDefault.label",
                ),
                value: examTemplate.institutionalDefault ? "Yes" : "No", // TODO @alain: bool?
            },
        ],
    };
};
