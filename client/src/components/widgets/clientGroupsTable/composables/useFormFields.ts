import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { useFormFieldsBasic } from "./useFormFieldsBasic.ts";
import { useFormFieldsScreenProctoring } from "./useFormFieldsScreenProctoring.ts";
import { useFormFieldsTypeIPRange } from "./useFormFieldsTypeIPRange.ts";
import { useFormFieldsTypeClientOS } from "./useFormFieldsTypeClientOS.ts";
import { useFormFieldsTypeNameAlphabeticalRange } from "./useFormFieldsTypeNameAlphabeticalRange.ts";
import { useRules } from "vuetify/labs/rules";

export const useFormFields = (
    groups: Ref<ClientGroupExisting[]>,
    screenProctoringAllowedForGroups: Ref<boolean>,
) => {
    const rules = useRules();

    const getFormFields = (clientGroup: Ref<ClientGroupTransient>) => {
        const formFields = computed<FormField[]>(() =>
            [
                useFormFieldsBasic(clientGroup, rules, groups),
                useFormFieldsScreenProctoring(
                    clientGroup,
                    screenProctoringAllowedForGroups,
                ),
                clientGroup.value.type === ClientGroupEnum.IP_V4_RANGE
                    ? useFormFieldsTypeIPRange(clientGroup, rules)
                    : [],
                clientGroup.value.type === ClientGroupEnum.CLIENT_OS
                    ? useFormFieldsTypeClientOS(clientGroup)
                    : [],
                clientGroup.value.type ===
                ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                    ? useFormFieldsTypeNameAlphabeticalRange(clientGroup, rules)
                    : [],
            ].flat(),
        );

        return formFields.value;
    };

    return {
        getFormFields,
    };
};
