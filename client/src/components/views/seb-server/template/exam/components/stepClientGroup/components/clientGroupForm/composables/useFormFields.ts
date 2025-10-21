import { computed, ComputedRef, ModelRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useFormFieldsBasic } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsBasic";
import { useFormFieldsScreenProctoring } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsScreenProctoring";
import { useFormFieldsTypeIPRange } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsTypeIPRange";
import { useFormFieldsTypeClientOS } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsTypeClientOS";
import { useFormFieldsTypeNameAlphabeticalRange } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsTypeNameAlphabeticalRange";

export const useFormFields = (
    clientGroup: ModelRef<ClientGroupTransient>,
): { isValid: ComputedRef<boolean>; formFields: ComputedRef<FormField[]> } => {
    const isValid = computed<boolean>({
        get: (): boolean => clientGroup.value.isValid,
        set: (value: boolean) => {
            clientGroup.value = { ...clientGroup.value, isValid: value };
        },
    });

    const formFields = computed<FormField[]>(() =>
        [
            useFormFieldsBasic(clientGroup),
            useFormFieldsScreenProctoring(clientGroup),
            clientGroup.value.type === ClientGroupEnum.IP_V4_RANGE
                ? useFormFieldsTypeIPRange(clientGroup)
                : [],
            clientGroup.value.type === ClientGroupEnum.CLIENT_OS
                ? useFormFieldsTypeClientOS(clientGroup)
                : [],
            clientGroup.value.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                ? useFormFieldsTypeNameAlphabeticalRange(clientGroup)
                : [],
        ].flat(),
    );

    return {
        isValid,
        formFields,
    };
};
