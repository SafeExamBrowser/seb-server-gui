import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/widgets/wizardSummary/types.ts";
import i18n from "@/i18n";
import { ClientGroup, ExamTemplate } from "@/models/seb-server/examTemplate.ts";
import { getClientGroupTypeDetails } from "@/utils/clientGroup.ts";

export const getSummaryClientGroups = (
    examTemplate: ExamTemplate,
): SummarySectionData => {
    const getClientGroup = (
        clientGroup: ClientGroup,
        clientGroupIndex: number,
    ) => {
        const items: (SummarySectionItem & { type: "basic" })[] = [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t("clientGroups.fields.name.label"),
                value: { type: "string", value: clientGroup.name },
            },
            {
                type: "basic" as const,
                key: "typeDetails",
                label: i18n.global.t("clientGroups.fields.type.label"),
                value: {
                    type: "string",
                    value: getClientGroupTypeDetails(clientGroup),
                },
            },
        ];

        if (
            examTemplate.EXAM_ATTRIBUTES.enableScreenProctoring === "true" &&
            examTemplate.EXAM_ATTRIBUTES.spsCollectingStrategy ===
                "APPLY_SEB_GROUPS" &&
            examTemplate.EXAM_ATTRIBUTES.spsSEBGroupsSelection
        ) {
            items.push({
                type: "basic" as const,
                key: "screenProctoringEnabled",
                label: i18n.global.t(
                    "clientGroups.fields.screenProctoringEnabled.label",
                ),
                value: {
                    type: "boolean",
                    value: examTemplate.EXAM_ATTRIBUTES.spsSEBGroupsSelection.includes(
                        clientGroupIndex.toString(),
                    ),
                },
            });
        }

        return {
            type: "collection" as const,
            key: `clientGroup-${clientGroup.name}`,
            items,
        };
    };

    const getFallbackGroupTypeValue = () => {
        if (examTemplate.EXAM_ATTRIBUTES.spsCollectingStrategy === "EXAM") {
            return i18n.global.t(
                "clientGroups.fields.type.types.SCREEN_PROCTORING_SINGLE",
            );
        }

        if (
            examTemplate.EXAM_ATTRIBUTES.spsCollectingStrategy ===
            "APPLY_SEB_GROUPS"
        ) {
            return i18n.global.t(
                "clientGroups.fields.type.types.SCREEN_PROCTORING_FALLBACK",
            );
        }

        // TODO @alain: look into this again when we have stricter API types.
        // If our spsCollectionStrategy is more stricly defined (i.e. specific values instead of any string), we can remove this fallback.
        return i18n.global.t("createTemplateExam.steps.summary.notFoundValue");
    };

    const getClientGroupFallback = () => {
        if (!examTemplate.EXAM_ATTRIBUTES.spsCollectingGroupName) {
            return undefined;
        }

        const items: (SummarySectionItem & { type: "basic" })[] = [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t("clientGroups.fields.name.label"),
                value: {
                    type: "string",
                    value: examTemplate.EXAM_ATTRIBUTES.spsCollectingGroupName,
                },
            },
            {
                type: "basic" as const,
                key: "typeDetails",
                label: i18n.global.t("clientGroups.fields.type.label"),
                value: {
                    type: "string",
                    value: getFallbackGroupTypeValue(),
                },
            },
            {
                type: "basic" as const,
                key: "screenProctoringEnabled",
                label: i18n.global.t(
                    "clientGroups.fields.screenProctoringEnabled.label",
                ),
                value: {
                    type: "boolean",
                    value: true,
                },
            },
        ];

        return {
            type: "collection" as const,
            key: `clientGroup-fallback`,
            items,
        };
    };

    return {
        label: i18n.global.t(
            "createTemplateExam.steps.summary.sections.clientGroup.title",
        ),
        items: [
            ...examTemplate.CLIENT_GROUP_TEMPLATES.map(
                (clientGroup, clientGroupIndex) =>
                    getClientGroup(clientGroup, clientGroupIndex),
            ),
            getClientGroupFallback(),
        ].filter((item) => item !== undefined),
    };
};
