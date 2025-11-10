import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { useFormFieldsBasic } from "./useFormFieldsBasic";
import { useRules } from "vuetify/labs/rules";
import { IndicatorTransient } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";

export const useFormFields = (indicator: Ref<IndicatorTransient>) => {
    const rules = useRules();
    const formFields = computed<FormField[]>(() =>
        [
            useFormFieldsBasic(indicator, rules),
            // TODO @alain: add additional form fields
        ].flat(),
    );

    return {
        formFields,
    };
};
