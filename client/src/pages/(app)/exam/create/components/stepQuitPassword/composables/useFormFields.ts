import { computed } from "vue";
import { storeToRefs } from "pinia";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import { useStepQuitPasswordStore } from "./store/useStepQuitPasswordStore.ts";

export const useFormFields = () => {
    const { quitPassword } = storeToRefs(useStepQuitPasswordStore());

    const formFields = computed<FormField[]>(() => [
        {
            type: "password" as const,
            name: "quitPassword",
            model: quitPassword,
            label: i18n.global.t(
                "createExam.steps.quitPassword.fields.quitPassword.label",
            ),
            placeholder: i18n.global.t(
                "createExam.steps.quitPassword.fields.quitPassword.placeholder",
            ),
        },
    ]);

    return { formFields };
};
