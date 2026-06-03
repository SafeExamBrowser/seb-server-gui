import { computed, ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

const URL_SUFFIX_PATTERN = /^$|^.{3,45}$/;
const LOGO_ACCEPT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

export const useInstitutionFormFields = () => {
    const name = ref<string | undefined>(undefined);
    const urlSuffix = ref<string | undefined>(undefined);
    const logoImage = ref<File | string | undefined>(undefined);

    const t = (key: string) => i18n.global.t(`institutions.${key}`);

    const rules = useRules();

    const formFields = computed<FormField[]>(() => [
        {
            type: "image",
            name: "logoImage",
            model: logoImage,
            label: t("fields.logoImage.label"),
            dropTitle: i18n.global.t("general.formFields.image.dropTitle"),
            hint: i18n.global.t("general.formFields.image.hint", {
                types: LOGO_ACCEPT_EXTENSIONS.join(", "),
            }),
            acceptExtensions: LOGO_ACCEPT_EXTENSIONS,
        },
        {
            type: "text",
            name: "name",
            model: name,
            label: t("fields.name.label"),
            required: true,
            rules: [rules.required(), rules.minLength(3), rules.maxLength(255)],
        },
        {
            type: "text",
            name: "urlSuffix",
            model: urlSuffix,
            label: t("fields.urlSuffix.label"),
            rules: [
                (v: string | undefined) =>
                    !v ||
                    URL_SUFFIX_PATTERN.test(v) ||
                    t("fields.urlSuffix.validation"),
            ],
        },
    ]);

    return {
        formFields,
        name,
        urlSuffix,
        logoImage,
    };
};
