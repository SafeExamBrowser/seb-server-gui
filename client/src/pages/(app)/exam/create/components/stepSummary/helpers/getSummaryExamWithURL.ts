import i18n from "@/i18n";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { useStepWithURLStore } from "@/pages/(app)/exam/create/components/stepWithURL/composables/store/useStepWithURLStore";
import { formatIsoToReadableTimeRange } from "@/utils/timeUtils";

export const getSummaryExamWithURL = (): SummarySectionData => {
    const stepWithURL = useStepWithURLStore();

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.examWithURL.title",
        ),
        items: [
            {
                type: "basic" as const,
                key: "examName",
                value: {
                    type: "string" as const,
                    value: stepWithURL.examName,
                },
                label: i18n.global.t(
                    "createExam.steps.withURL.fields.examName.label",
                ),
            },
            {
                type: "basic" as const,
                key: "examDescription",
                value: {
                    type: "string" as const,
                    value: stepWithURL.examDescription,
                },
                label: i18n.global.t(
                    "createExam.steps.withURL.fields.examDescription.label",
                ),
            },
            {
                type: "basic" as const,
                key: "timeRange",
                value: {
                    type: "string" as const,
                    value: formatIsoToReadableTimeRange(stepWithURL.timeRange),
                },
                label: i18n.global.t(
                    "createExam.steps.withURL.fields.timeRange.label",
                ),
            },
            {
                type: "basic" as const,
                key: "examURL",
                value: {
                    type: "string" as const,
                    value: stepWithURL.examURL,
                },
                label: i18n.global.t(
                    "createExam.steps.withURL.fields.examURL.label",
                ),
            },
        ],
    };
};
