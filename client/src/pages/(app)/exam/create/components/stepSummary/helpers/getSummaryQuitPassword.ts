import { SummarySectionData } from "@/components/widgets/wizardSummary/types.ts";
import i18n from "@/i18n";

export const getSummaryQuitPassword = (
    quitPassword: string,
): SummarySectionData => ({
    label: i18n.global.t(
        "createExam.steps.summary.sections.quitPassword.title",
    ),
    items: [
        quitPassword
            ? {
                  type: "basic" as const,
                  key: "quitPassword",
                  label: i18n.global.t(
                      "createExam.steps.quitPassword.fields.quitPassword.label",
                  ),
                  value: {
                      type: "password" as const,
                      value: quitPassword,
                  },
              }
            : {
                  type: "basic" as const,
                  key: "quitPassword",
                  label: i18n.global.t(
                      "createExam.steps.quitPassword.fields.quitPassword.label",
                  ),
                  value: {
                      type: "string" as const,
                      value: i18n.global.t(
                          "createExam.steps.summary.emptyValue",
                      ),
                  },
              },
    ],
});
