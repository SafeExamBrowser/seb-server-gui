import i18n from "@/i18n";
import {
    ClientGroupTemplate,
    ExamTemplate,
} from "@/models/seb-server/examTemplate";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

export const getSummaryClientGroups = (
    examTemplate: ExamTemplate,
): SummarySectionData => {
    const getTypeDetails = (clientGroup: ClientGroupTemplate): string => {
        let typeDetails = i18n.global.t(
            `createTemplateExam.steps.clientGroup.fields.type.types.${clientGroup.type}`,
        );

        // TODO @alain: look into this again when we have stricter API types.
        // We work with the API types here. They are not very clean,
        // i.e. there are no discriminated unions for the client group types.
        // This is a source of potential bugs (e.g. an additional clientGroup.type or
        // a missing clientGroup.clientOS would cause uncaught errors).
        // Hopefully we can have stricter API types in the future so we can be more precise here.
        if (clientGroup.type === ClientGroupEnum.IP_V4_RANGE) {
            typeDetails += ` (${clientGroup.ipRangeStart} – ${clientGroup.ipRangeEnd})`;
        }

        if (clientGroup.type === ClientGroupEnum.CLIENT_OS) {
            typeDetails += ` (${i18n.global.t(
                `createTemplateExam.steps.clientGroup.fields.clientOS.types.${clientGroup.clientOS}`,
            )})`;
        }

        if (clientGroup.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE) {
            typeDetails += ` (${clientGroup.nameRangeStartLetter} – ${clientGroup.nameRangeEndLetter})`;
        }

        return typeDetails;
    };

    const getSummaryClientGroup = (
        clientGroup: ClientGroupTemplate,
        clientGroupIndex: number,
    ) => {
        const items: (SummarySectionItem & { type: "basic" })[] = [
            {
                type: "basic" as const,
                key: "name",
                label: i18n.global.t(
                    "createTemplateExam.steps.clientGroup.fields.name.label",
                ),
                value: { type: "string", value: clientGroup.name },
            },
            {
                type: "basic" as const,
                key: "typeDetails",
                label: i18n.global.t(
                    "createTemplateExam.steps.clientGroup.fields.type.label",
                ),
                value: {
                    type: "string",
                    value: getTypeDetails(clientGroup),
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
                    "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
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

    return {
        label: i18n.global.t(
            "createTemplateExam.steps.summary.sections.clientGroup.title",
        ),
        items: examTemplate.CLIENT_GROUP_TEMPLATES.map(
            (clientGroup, clientGroupIndex) =>
                getSummaryClientGroup(clientGroup, clientGroupIndex),
        ),
    };
};
