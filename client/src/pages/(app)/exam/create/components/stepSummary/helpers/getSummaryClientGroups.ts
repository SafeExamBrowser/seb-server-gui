import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/widgets/wizardSummary/types.ts";
import i18n from "@/i18n";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";

export const getSummaryClientGroups = (
    clientGroups: ClientGroup[],
): SummarySectionData => {
    const getGroupItems = (group: ClientGroup) =>
        [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.clientGroups.fields.name.label",
                ),
                value: { type: "string", value: group.name },
            },
            {
                type: "basic" as const,
                key: "type",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.clientGroups.fields.type.label",
                ),
                value: { type: "string", value: i18n.global.t(group.type) },
            },
        ] satisfies SummarySectionItem[];

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.clientGroups.title",
        ),
        items: clientGroups.map((group, index) => ({
            type: "collection" as const,
            key: `group-${group.id ?? index}-${group.name}`,
            items: getGroupItems(group),
        })),
    };
};
