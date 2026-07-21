import { Ref } from "vue";
import { RuleAliases } from "vuetify/labs/rules";

import { ClientGroupTransient } from "@/components/widgets/clientGroupsTable/types.ts";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";

import { useFormFieldsBasic } from "./useFormFieldsBasic.ts";
import { useFormFieldsScreenProctoring } from "./useFormFieldsScreenProctoring.ts";
import { useFormFieldsTypeClientOS } from "./useFormFieldsTypeClientOS.ts";
import { useFormFieldsTypeIPRange } from "./useFormFieldsTypeIPRange.ts";
import { useFormFieldsTypeNameAlphabeticalRange } from "./useFormFieldsTypeNameAlphabeticalRange.ts";

export const useFormFields = (
    groups: Ref<ClientGroupExisting[]>,
    screenProctoringAllowedForGroups: Ref<boolean>,
    rules: RuleAliases,
) => {
    const getFormFields = (
        clientGroup: Ref<ClientGroupTransient>,
    ): FormField[] =>
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
            clientGroup.value.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                ? useFormFieldsTypeNameAlphabeticalRange(clientGroup, rules)
                : [],
        ].flat();

    return {
        getFormFields,
    };
};
