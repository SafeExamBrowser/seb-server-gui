import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types";

export const useFormFieldsTypeNameAlphabeticalRange = (
    clientGroup: Ref<ClientGroupTransient>,
): FormField[] => {
    const nameRangeStartLetter = computed<string>({
        get: (): string => clientGroup.value.nameRangeStartLetter || "",
        set: (value: string) => {
            clientGroup.value = {
                ...clientGroup.value,
                nameRangeStartLetter: value,
            };
        },
    });

    const nameRangeEndLetter = computed<string>({
        get: (): string => clientGroup.value.nameRangeEndLetter || "",
        set: (value: string) => {
            clientGroup.value = {
                ...clientGroup.value,
                nameRangeEndLetter: value,
            };
        },
    });

    return [
        {
            type: "text" as const,
            name: "nameRangeStartLetter",
            model: nameRangeStartLetter,
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.nameRangeStartLetter.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.nameRangeStartLetter.placeholder",
            ),
            required: true,
        },
        {
            type: "text" as const,
            name: "nameRangeEndLetter",
            model: nameRangeEndLetter,
            label: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.nameRangeEndLetter.label",
            ),
            placeholder: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.nameRangeEndLetter.placeholder",
            ),
            required: true,
        },
    ];
};
