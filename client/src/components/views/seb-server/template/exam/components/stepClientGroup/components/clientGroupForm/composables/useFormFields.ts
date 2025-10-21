import { computed, ComputedRef, ModelRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useI18n } from "vue-i18n";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { storeToRefs } from "pinia";
import { useFormFieldsTypeIpRange } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsTypeIpRange";
import { useFormFieldsBasic } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupForm/composables/useFormFieldsBasic";

export const useFormFields = (
    clientGroup: ModelRef<ClientGroupTransient>,
): { isValid: ComputedRef<boolean>; formFields: ComputedRef<FormField[]> } => {
    const { t } = useI18n();

    const { screenProctoringAllowedForGroups } = storeToRefs(
        useScreenProctoringStore(),
    );

    const isValid = computed<boolean>({
        get: (): boolean => clientGroup.value.isValid,
        set: (value: boolean) => {
            clientGroup.value = { ...clientGroup.value, isValid: value };
        },
    });

    const screenProctoringEnabled = computed<
        ClientGroupTransient["screenProctoringEnabled"]
    >({
        get: (): ClientGroupTransient["screenProctoringEnabled"] =>
            clientGroup.value.screenProctoringEnabled,
        set: (value: ClientGroupTransient["screenProctoringEnabled"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                screenProctoringEnabled: value,
            };
        },
    });

    const formFields = computed<FormField[]>(() =>
        [
            useFormFieldsBasic(clientGroup),
            screenProctoringAllowedForGroups.value
                ? [
                      {
                          type: "switch" as const,
                          name: "screenProctoringEnabled",
                          model: screenProctoringEnabled,
                          label: t(
                              "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
                          ),
                      },
                  ]
                : [],
            clientGroup.value.type === ClientGroupEnum.IP_V4_RANGE
                ? useFormFieldsTypeIpRange(clientGroup)
                : [],
        ].flat(),
    );

    return {
        isValid,
        formFields,
    };
};
