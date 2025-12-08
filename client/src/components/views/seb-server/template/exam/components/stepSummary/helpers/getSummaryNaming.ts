import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

const emptyValue = "–" as const;

export const getSummaryNaming = (examTemplate: ExamTemplate) => ({
    label: i18n.global.t(
        "createTemplateExam.steps.summary.sections.naming.title",
    ),
    items: [
        {
            type: "basic" as const,
            key: "name",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.name.label",
            ),
            value: examTemplate.name,
        },
        {
            type: "basic" as const,
            key: "description",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.description.label",
            ),
            value: examTemplate.description ?? emptyValue,
        },
        {
            type: "basic" as const,
            key: "examType",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.examType.label",
            ),
            value: examTemplate.examType ?? emptyValue, // TODO @alain: translate type
        },
        {
            type: "basic" as const,
            key: "clientConfiguration",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.clientConfiguration.label",
            ),
            value: examTemplate.clientConfigurationId
                ? `${examTemplate.clientConfigurationId}` // TODO @alain: show name instead of id
                : emptyValue,
        },
        {
            type: "basic" as const,
            key: "configurationTemplate",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.configurationTemplate.label",
            ),
            value: examTemplate.configurationTemplateId
                ? `${examTemplate.configurationTemplateId}` // TODO @alain: show name instead of id
                : emptyValue,
        },
        {
            type: "basic" as const,
            key: "lmsIntegration",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.lmsIntegration.label",
            ),
            value: examTemplate.lmsIntegration ? "Yes" : "No", // TODO @alain: bool?
        },
        {
            type: "basic" as const,
            key: "institutionalDefault",
            label: i18n.global.t(
                "createTemplateExam.steps.naming.fields.institutionalDefault.label",
            ),
            value: examTemplate.institutionalDefault ? "Yes" : "No", // TODO @alain: bool?
        },
    ],
});
