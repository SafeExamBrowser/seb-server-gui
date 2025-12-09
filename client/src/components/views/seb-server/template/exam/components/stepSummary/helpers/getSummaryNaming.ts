import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import { ConfigurationTemplateName } from "@/models/seb-server/configurationNode";
import { ConnectionConfigurationName } from "@/models/seb-server/connectionConfiguration";

export const getSummaryNaming = (
    examTemplate: ExamTemplate,
    configurationTemplateNames: ConfigurationTemplateName[],
    clientConfigurationNames: ConnectionConfigurationName[],
): SummarySectionData => {
    const getConfigurationTemplateValue = (
        configurationTemplateId?: number,
    ) => {
        if (!configurationTemplateId) {
            return i18n.global.t("createTemplateExam.steps.summary.emptyValue");
        }

        const configurationTemplate = configurationTemplateNames.find(
            (configurationTemplate) =>
                configurationTemplate.modelId ===
                configurationTemplateId.toString(),
        );

        return (
            configurationTemplate?.name ??
            i18n.global.t("createTemplateExam.steps.summary.notFoundValue")
        );
    };

    const getClientConfigurationValue = (clientConfigurationId?: number) => {
        if (!clientConfigurationId) {
            return i18n.global.t("createTemplateExam.steps.summary.emptyValue");
        }

        const clientConfiguration = clientConfigurationNames.find(
            (clientConfiguration) =>
                clientConfiguration.modelId ===
                clientConfigurationId.toString(),
        );

        return (
            clientConfiguration?.name ??
            i18n.global.t("createTemplateExam.steps.summary.notFoundValue")
        );
    };

    return {
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
                value: { type: "string", value: examTemplate.name },
            },
            {
                type: "basic" as const,
                key: "description",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.description.label",
                ),
                value: {
                    type: "string",
                    value:
                        examTemplate.description ??
                        i18n.global.t(
                            "createTemplateExam.steps.summary.emptyValue",
                        ),
                },
            },
            {
                type: "basic" as const,
                key: "examType",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.examType.label",
                ),
                value: {
                    type: "string",
                    value: examTemplate.examType
                        ? i18n.global.t(examTemplate.examType)
                        : i18n.global.t(
                              "createTemplateExam.steps.summary.emptyValue",
                          ),
                },
            },
            {
                type: "basic" as const,
                key: "clientConfiguration",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.clientConfiguration.label",
                ),
                value: {
                    type: "string",
                    value: getClientConfigurationValue(
                        examTemplate.clientConfigurationId,
                    ),
                },
            },
            {
                type: "basic" as const,
                key: "configurationTemplate",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.configurationTemplate.label",
                ),
                value: {
                    type: "string",
                    value: getConfigurationTemplateValue(
                        examTemplate.configurationTemplateId,
                    ),
                },
            },
            {
                type: "basic" as const,
                key: "lmsIntegration",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.lmsIntegration.label",
                ),
                value: {
                    type: "boolean",
                    value: examTemplate.lmsIntegration,
                },
            },
            {
                type: "basic" as const,
                key: "institutionalDefault",
                label: i18n.global.t(
                    "createTemplateExam.steps.naming.fields.institutionalDefault.label",
                ),
                value: {
                    type: "boolean",
                    value: examTemplate.institutionalDefault,
                },
            },
            {
                type: "basic" as const,
                key: "screenProctoringEnabled",
                label: i18n.global.t(
                    "createTemplateExam.general.fields.screenProctoringEnabled.label",
                ),
                value: {
                    type: "boolean",
                    value:
                        examTemplate.EXAM_ATTRIBUTES.enableScreenProctoring ===
                        "true",
                },
            },
        ],
    };
};
