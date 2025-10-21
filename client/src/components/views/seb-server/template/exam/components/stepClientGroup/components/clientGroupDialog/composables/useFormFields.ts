import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useFormFieldsBasic } from "./useFormFieldsBasic";
import { useFormFieldsScreenProctoring } from "./useFormFieldsScreenProctoring";
import { useFormFieldsTypeIPRange } from "./useFormFieldsTypeIPRange";
import { useFormFieldsTypeClientOS } from "./useFormFieldsTypeClientOS";
import { useFormFieldsTypeNameAlphabeticalRange } from "./useFormFieldsTypeNameAlphabeticalRange";

export const useFormFields = (clientGroup: Ref<ClientGroupTransient>) => {
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

    return formFields;
};
