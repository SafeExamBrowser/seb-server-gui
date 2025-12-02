import {
    SummarySectionData,
    SummarySectionItem,
} from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import { ComputedRef } from "vue";
import { computed } from "vue";
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";
import i18n from "@/i18n";
import { ClientGroupTemplate } from "@/models/seb-server/examTemplate";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

const emptyValue = "–" as const;

export const useSummary = (): ComputedRef<SummarySectionData[]> => {
    const examTemplate = useCreateExamTemplateStore().examTemplate;

    const getClientGroupItems = (
        clientGroup: ClientGroupTemplate,
    ): (SummarySectionItem & { type: "basic" })[] => {
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

        return [
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
        ];
    };

    const summary = computed<SummarySectionData[]>(() => [
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.naming.title",
            ),
            items: [
                {
                    type: "basic",
                    key: "name",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.name.label",
                    ),
                    value: examTemplate.name,
                },
                {
                    type: "basic",
                    key: "description",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.description.label",
                    ),
                    value: examTemplate.description ?? emptyValue,
                },
                {
                    type: "basic",
                    key: "examType",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.examType.label",
                    ),
                    value: examTemplate.examType ?? emptyValue, // TODO @alain: translate type
                },
                {
                    type: "basic",
                    key: "clientConfiguration",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.clientConfiguration.label",
                    ),
                    value: examTemplate.clientConfigurationId
                        ? `${examTemplate.clientConfigurationId}` // TODO @alain: show name instead of id
                        : emptyValue,
                },
                {
                    type: "basic",
                    key: "configurationTemplate",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.configurationTemplate.label",
                    ),
                    value: examTemplate.configurationTemplateId
                        ? `${examTemplate.configurationTemplateId}` // TODO @alain: show name instead of id
                        : emptyValue,
                },
                {
                    type: "basic",
                    key: "lmsIntegration",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.lmsIntegration.label",
                    ),
                    value: examTemplate.lmsIntegration ? "Yes" : "No", // TODO @alain: bool?
                },
                {
                    type: "basic",
                    key: "institutionalDefault",
                    label: i18n.global.t(
                        "createTemplateExam.steps.naming.fields.institutionalDefault.label",
                    ),
                    value: examTemplate.institutionalDefault ? "Yes" : "No", // TODO @alain: bool?
                },
            ],
        },
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
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.indicators.title",
            ),
            items: [
                {
                    type: "basic",
                    key: "indicator-foo",
                    label: "Foo",
                    value: "Bar",
                },
            ],
        },
        {
            label: i18n.global.t(
                "createTemplateExam.steps.summary.sections.clientGroup.title",
            ),
            items: examTemplate.CLIENT_GROUP_TEMPLATES.map((clientGroup) => ({
                type: "collection",
                key: `clientGroup-${clientGroup.name}`,
                items: getClientGroupItems(clientGroup),
            })),
        },
    ]);

    return summary;
};
