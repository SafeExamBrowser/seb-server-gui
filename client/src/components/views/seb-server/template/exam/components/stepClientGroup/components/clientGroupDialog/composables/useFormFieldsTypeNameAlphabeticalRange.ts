import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed, ref, Ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types";
import { RuleAliases } from "vuetify/labs/rules";
import { VInput } from "vuetify/components";

const triggerDependentFieldValidation = (fieldRef: Ref<VInput | undefined>) => {
    // the fieldRef is an array, because of the way the FormBuilder component is implemented (v-if / v-else), which could theoretically bind the same ref to several fields (but doesn't happen in practice)
    const fieldRefCleaned = Array.isArray(fieldRef.value)
        ? fieldRef.value[0]
        : fieldRef.value;

    requestAnimationFrame(() => {
        // trigger validation of field B, which depends on the value of field A
        // we do that only in the next frame, so the validation can use the updated value of field A
        fieldRefCleaned?.validate(true);
    });
};

export const useFormFieldsTypeNameAlphabeticalRange = (
    clientGroup: Ref<ClientGroupTransient>,
    rules: RuleAliases,
): FormField[] => {
    const fieldNameRangeStartLetterRef = ref<VInput>();
    const fieldNameRangeEndLetterRef = ref<VInput>();

    const nameRangeStartLetter = computed<string>({
        get: (): string => clientGroup.value.nameRangeStartLetter || "",
        set: (value: string) => {
            clientGroup.value = {
                ...clientGroup.value,
                nameRangeStartLetter: value,
            };

            triggerDependentFieldValidation(fieldNameRangeEndLetterRef);
        },
    });

    const nameRangeEndLetter = computed<string>({
        get: (): string => clientGroup.value.nameRangeEndLetter || "",
        set: (value: string) => {
            clientGroup.value = {
                ...clientGroup.value,
                nameRangeEndLetter: value,
            };

            triggerDependentFieldValidation(fieldNameRangeStartLetterRef);
        },
    });

    return [
        {
            ref: fieldNameRangeStartLetterRef,
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
            rules: [
                rules.maxLength(255),
                rules.alphabeticalBefore(nameRangeEndLetter.value),
            ],
        },
        {
            ref: fieldNameRangeEndLetterRef,
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
            rules: [
                rules.maxLength(255),
                rules.alphabeticalAfter(nameRangeStartLetter.value),
            ],
        },
    ];
};
