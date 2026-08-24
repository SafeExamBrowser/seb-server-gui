import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/widgets/wizardSummary/types.ts";
import i18n from "@/i18n";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import {
    ClientGroupFallback,
    FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS,
    getExamClientGroupTypeDetails,
} from "@/utils/clientGroup.ts";

export const getSummaryClientGroups = (
    clientGroups: ClientGroup[],
    fallbackGroup?: ClientGroupFallback,
): SummarySectionData => {
    const getGroupItems = (name: string, typeDetails: string) =>
        [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.clientGroups.fields.name.label",
                ),
                value: { type: "string", value: name },
            },
            {
                type: "basic" as const,
                key: "type",
                label: i18n.global.t(
                    "createExam.steps.summary.sections.clientGroups.fields.type.label",
                ),
                value: { type: "string", value: typeDetails },
            },
        ] satisfies SummarySectionItem[];

    const fallbackItems =
        fallbackGroup === undefined
            ? []
            : [
                  {
                      type: "collection" as const,
                      key: `group-${fallbackGroup.id}-${fallbackGroup.name}`,
                      items: getGroupItems(
                          fallbackGroup.name,
                          i18n.global.t(
                              FALLBACK_GROUP_TYPE_LABEL_I18N_KEYS[
                                  fallbackGroup.type
                              ],
                          ),
                      ),
                  },
              ];

    return {
        label: i18n.global.t(
            "createExam.steps.summary.sections.clientGroups.title",
        ),
        items: [
            ...clientGroups.map((group, index) => ({
                type: "collection" as const,
                key: `group-${group.id ?? index}-${group.name}`,
                items: getGroupItems(
                    group.name,
                    getExamClientGroupTypeDetails(group),
                ),
            })),
            ...fallbackItems,
        ],
    };
};
