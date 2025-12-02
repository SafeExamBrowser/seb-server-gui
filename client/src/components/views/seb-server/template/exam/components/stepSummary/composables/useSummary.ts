import { SummaryBox } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import i18n from "@/i18n";

const emptyValue = "–" as const;

export const useSummary = (): ComputedRef<SummaryBox[]> => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const summary = computed<SummaryBox[]>(() => [
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.naming.title",
            ),
            items: [
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.name.label",
                    ),
                    value: examTemplate.name,
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.description.label",
                    ),
                    value: examTemplate.description ?? emptyValue,
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.examType.label",
                    ),
                    value: examTemplate.examType ?? emptyValue,
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.clientConfiguration.label",
                    ),
                    value: examTemplate.clientConfigurationId
                        ? `${examTemplate.clientConfigurationId}` // TODO @alain: show name instead of id
                        : emptyValue,
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.configurationTemplate.label",
                    ),
                    value: examTemplate.configurationTemplateId
                        ? `${examTemplate.configurationTemplateId}` // TODO @alain: show name instead of id
                        : emptyValue,
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.lmsIntegration.label",
                    ),
                    value: examTemplate.lmsIntegration ? "Yes" : "No", // TODO @alain: bool?
                },
                {
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.institutionalDefault.label",
                    ),
                    value: examTemplate.institutionalDefault ? "Yes" : "No", // TODO @alain: bool?
                },
            ],
        },
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.supervisors.title",
            ),
            items: [
                {
                    label: "Foo",
                    value: "Bar",
                },
            ],
        },
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.indicators.title",
            ),
            items: [
                {
                    label: "Foo",
                    value: "Bar",
                },
            ],
        },
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.clientGroup.title",
            ),
            items: [
                {
                    label: "Foo",
                    value: "Bar",
                },
            ],
        },
    ]);

    return summary;
};
