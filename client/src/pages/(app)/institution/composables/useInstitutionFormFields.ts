import { computed, ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

const URL_SUFFIX_PATTERN = /^$|^.{3,45}$/;

export const useInstitutionFormFields = () => {
    const name = ref<string | undefined>(undefined);
    const urlSuffix = ref<string | undefined>(undefined);
    const themeName = ref<string | undefined>(undefined);
    const logoImage = ref<string | undefined>(undefined);

    const t = (key: string) =>
        i18n.global.t(`institutions.institutionFormFields.${key}`);

    const rules = useRules();

    const formFields = computed<FormField[]>(() => [
        {
            type: "text",
            name: "name",
            model: name,
            label: t("labels.name"),
            required: true,
            rules: [rules.required(), rules.minLength(3), rules.maxLength(255)],
        },
        {
            type: "text",
            name: "urlSuffix",
            model: urlSuffix,
            label: t("labels.urlSuffix"),
            rules: [
                (v: string | undefined) =>
                    !v ||
                    URL_SUFFIX_PATTERN.test(v) ||
                    t("validation.urlSuffix"),
            ],
        },
        {
            type: "text",
            name: "themeName",
            model: themeName,
            label: t("labels.themeName"),
        },
        {
            type: "text",
            name: "logoImage",
            model: logoImage,
            label: t("labels.logoImage"),
        },
    ]);

    return {
        formFields,
        name,
        urlSuffix,
        themeName,
        logoImage,
    };
};
