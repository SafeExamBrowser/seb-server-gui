import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import i18n from "@/i18n";
import {
    ClientGroupTemplate,
    ExamTemplate,
} from "@/models/seb-server/examTemplate";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

export const useSummaryClientGroups = (
    examTemplate: ExamTemplate,
): SummarySectionData => {
    const getTypeDetails = (clientGroup: ClientGroupTemplate): string => {
        let typeDetails = clientGroup.type; // TODO @alain: translate type

        // TODO @alain: look into this again when we have stricter API types.
        // We work with the API types here. They are not very clean,
        // i.e. there are no discriminated unions for the client group types.
        // This is a source of potential bugs (e.g. an additional clientGroup.type or
        // a missing clientGroup.clientOS would cause uncaught errors).
        // Hopefully we can have stricter API types in the future so we can be more precise here.
        if (clientGroup.type === ClientGroupEnum.IP_V4_RANGE) {
            typeDetails += ` (${clientGroup.ipRangeStart} - ${clientGroup.ipRangeEnd})`;
        }

        if (clientGroup.type === ClientGroupEnum.CLIENT_OS) {
            typeDetails += ` (${clientGroup.clientOS})`;
        }

        if (clientGroup.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE) {
            typeDetails += ` (${clientGroup.nameRangeStartLetter} - ${clientGroup.nameRangeEndLetter})`;
        }

        return typeDetails;
    };

    return {
        label: i18n.global.t(
            "createTemplateExam.steps.summary.sections.clientGroup.title",
        ),
        items: examTemplate.CLIENT_GROUP_TEMPLATES.map((clientGroup) => ({
            type: "collection",
            key: `clientGroup-${clientGroup.name}`,
            items: [
                {
                    type: "basic",
                    key: "name",
                    label: i18n.global.t(
                        "createTemplateExam.steps.clientGroup.fields.name.label",
                    ),
                    value: clientGroup.name,
                },
                {
                    type: "basic",
                    key: "typeDetails",
                    label: i18n.global.t(
                        "createTemplateExam.steps.clientGroup.fields.type.label",
                    ),
                    value: getTypeDetails(clientGroup),
                },
            ],
        })),
    };
};
