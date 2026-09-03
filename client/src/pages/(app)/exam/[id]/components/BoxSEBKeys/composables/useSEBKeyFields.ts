import { computed, ref } from "vue";
import { useRules } from "vuetify/labs/rules";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import { useFetchSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useFetchSEBKeys";

export const useSEBKeyFields = (examId: string) => {
    const { data, loading, error } = useFetchSEBKeys(examId);

    const browserExamKeyRef = ref<string>("");
    const sebServerBEKRef = ref<string>("");
    const configKeyRef = ref<string>("");

    const formFields = computed<FormField[]>(() => {
        const fields: FormField[] = [];
        if (!data.value) {
            return fields;
        }

        configKeyRef.value = data.value.configKeys.join("\n");
        browserExamKeyRef.value = data.value.browserExamKeys.join("\n");

        fields.push({
            type: "text" as const,
            name: "configKey",
            model: configKeyRef,
            label: i18n.global.t("examDetail.boxes.sebKeys.configKey"),
            required: false,
            disabled: true,
        });

        if (data.value.additionalProperties.ALTERNATIVE_SEB_BEK) {
            sebServerBEKRef.value =
                data.value.additionalProperties.ALTERNATIVE_SEB_BEK;
            fields.push({
                type: "text" as const,
                name: "sebServerExamKey",
                model: sebServerBEKRef,
                label: i18n.global.t(
                    "examDetail.boxes.sebKeys.sebServerExamKey",
                ),
                required: false,
                disabled: true,
            });
        }

        fields.push({
            type: "textarea" as const,
            name: "browserExamKey",
            model: browserExamKeyRef,
            label: i18n.global.t("examDetail.boxes.sebKeys.browserExamKey"),
            required: false,
            rules: [useRules().maxLength(4000)],
        });

        return fields;
    });

    return {
        formFields,
        loading,
        error,

        browserExamKeyRef,
        sebServerBEKRef,
        configKeyRef,
    };
};
