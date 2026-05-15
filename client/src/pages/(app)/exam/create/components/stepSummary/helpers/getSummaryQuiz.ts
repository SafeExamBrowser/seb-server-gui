import i18n from "@/i18n";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import { Quiz } from "@/models/seb-server/quiz.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

export const getSummaryQuiz = (quiz: Quiz | undefined): SummarySectionData => {
    const emptyValue = i18n.global.t("createExam.steps.summary.emptyValue");

    return {
        label: i18n.global.t("createExam.steps.summary.sections.quiz.title"),
        items: [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.quiz.fields.name.label",
                ),
                value: {
                    type: "string",
                    value: quiz?.quiz_name ?? emptyValue,
                },
            },
            {
                type: "basic" as const,
                key: "start",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.quiz.fields.start.label",
                ),
                value: {
                    type: "string",
                    value: quiz
                        ? formatIsoToReadableDateTime(quiz.quiz_start_time)
                        : emptyValue,
                },
            },
            {
                type: "basic" as const,
                key: "end",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.quiz.fields.end.label",
                ),
                value: {
                    type: "string",
                    value: quiz
                        ? formatIsoToReadableDateTime(quiz.quiz_end_time)
                        : emptyValue,
                },
            },
        ],
    };
};
