import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/widgets/wizardSummary/types.ts";
import i18n from "@/i18n";
import { UserAccountName } from "@/models/userAccount.ts";

export const getSummarySupervisors = (
    selectedSupervisorIds: string[],
    userAccounts: UserAccountName[],
): SummarySectionData => {
    const getSupervisorItems = (supervisorId: string) => {
        const supervisorName = userAccounts.find(
            (userAccount) => userAccount.modelId === supervisorId,
        )?.name;

        return [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.supervisors.fields.user.label",
                ),
                value: {
                    type: "string",
                    value:
                        supervisorName ??
                        i18n.global.t("createExam.steps.summary.notFoundValue"),
                },
            },
        ] satisfies SummarySectionItem[];
    };

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.supervisors.title",
        ),
        items: selectedSupervisorIds.map((supervisorId) => ({
            type: "collection" as const,
            key: `supervisor-${supervisorId}`,
            items: getSupervisorItems(supervisorId),
        })),
    };
};
