import { computed, ComputedRef, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useFormFieldsBasic } from "./useFormFieldsBasic";
import { useFormFieldsScreenProctoring } from "./useFormFieldsScreenProctoring";
import { useFormFieldsTypeIPRange } from "./useFormFieldsTypeIPRange";
import { useFormFieldsTypeClientOS } from "./useFormFieldsTypeClientOS";
import { useFormFieldsTypeNameAlphabeticalRange } from "./useFormFieldsTypeNameAlphabeticalRange";

export const useFormFields = (
    clientGroup: Ref<ClientGroupTransient>,
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
