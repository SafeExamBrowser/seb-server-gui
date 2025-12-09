import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { UserAccountName } from "@/models/userAccount";

export const getSummarySupervisors = (
    examTemplate: ExamTemplate,
    userAccounts: UserAccountName[],
): SummarySectionData => {
    const getSupervisorItems = (supervisorId: string) => {
        const supervisorName = userAccounts.find(
            (userAccount) => userAccount.modelId === supervisorId,
        )?.name;

        if (!supervisorName) {
            return [];
        }

        return [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createTemplateExam.steps.summary.sections.supervisors.fields.user.label",
                ),
                value: { type: "string", value: supervisorName },
            },
        ] satisfies SummarySectionItem[];
    };

    return {
        label: i18n.global.t(
            "createTemplateExam.steps.summary.sections.supervisors.title",
        ),
        items: examTemplate.supporter.map((supervisorId) => ({
            type: "collection" as const,
            key: `supervisor-${supervisorId}`,
            items: getSupervisorItems(supervisorId),
        })),
    };
};
