import { computed, ModelRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useI18n } from "vue-i18n";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

export const useFormFields = (clientGroup: ModelRef<ClientGroup>) => {
    const { t } = useI18n();

    const name = computed<ClientGroup["name"]>({
        get: (): ClientGroup["name"] => clientGroup.value.name,
        set: (value: ClientGroup["name"]) => {
            clientGroup.value = { ...clientGroup.value, name: value };
        },
    });

    const type = computed<ClientGroup["type"]>({
        get: (): ClientGroup["type"] => clientGroup.value.type,
        set: (value: ClientGroup["type"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                type: value,
            } as ClientGroup; // TODO @alain: fix this. Create a second type "ClientGroupTransient" that is losely typed (most things optional, no discriminated union). Use this type in the form fields and then convert to ClientGroup when submitting.
        },
    });

    const formFields: FormField[] = [
        {
            type: "text" as const,
            name: "name",
            model: name,
            label: t("createTemplateExam.steps.clientGroup.fields.name.label"),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.name.placeholder",
            ),
            required: true,
        },
        {
            type: "select" as const,
            name: "type",
            model: type,
            options: [
                ClientGroupEnum.IP_V4_RANGE,
                ClientGroupEnum.CLIENT_OS,
                ClientGroupEnum.NAME_ALPHABETICAL_RANGE,
            ].map((value) => ({
                value,
                text: t(
                    `createTemplateExam.steps.clientGroup.fields.type.types.${value}`,
                ),
            })),
            label: t("createTemplateExam.steps.clientGroup.fields.type.label"),
            placeholder: t(
                "createTemplateExam.steps.clientGroup.fields.type.placeholder",
            ),
            required: true,
        },
    ];

    return {
        formFields,
    };
};
