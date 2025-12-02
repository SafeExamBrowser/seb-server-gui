import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import i18n from "@/i18n";
import { useSummaryClientGroups } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryClientGroups";
import { useSummaryNaming } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryNaming";
import { useSummaryIndicators } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummaryIndicators";

export const useSummary = (): ComputedRef<SummarySectionData[]> => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const summary = computed<SummarySectionData[]>(() => [
        useSummaryNaming(examTemplate),
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.supervisors.title",
            ),
            items: [
                {
                    type: "basic",
                    key: "supervisor-foo",
                    label: "Foo",
                    value: "Bar",
                },
            ],
        },
        useSummaryIndicators(examTemplate),
        useSummaryClientGroups(examTemplate),
    ]);

    return summary;
};
