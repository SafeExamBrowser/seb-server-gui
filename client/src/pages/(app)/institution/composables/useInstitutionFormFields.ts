import { computed, ref } from "vue";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import i18n from "@/i18n";
import { institutionCreateSchema } from "@/models/institution.ts";

const URL_SUFFIX_PATTERN = /^$|^.{3,45}$/;
const LOGO_ACCEPT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

export const useInstitutionFormFields = () => {
    const name = ref<string | undefined>(undefined);
    const urlSuffix = ref<string | undefined>(undefined);
    const logoImage = ref<File | string | undefined>(undefined);

    const { isRequired, fieldRules } = useZodFormRules();

    // urlSuffix is "empty or 3-45 chars" — a regex useZodFormRules can't derive.
    const urlSuffixRule = (value: string | undefined) =>
        !value ||
        URL_SUFFIX_PATTERN.test(value) ||
        i18n.global.t("institutions.fields.urlSuffix.validation");

    const formFields = computed<FormField[]>(() => [
        {
            type: "image",
            name: "logoImage",
            model: logoImage,
            label: i18n.global.t("institutions.fields.logoImage.label"),
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
            label: i18n.global.t("institutions.fields.name.label"),
            required: isRequired(institutionCreateSchema.shape.name),
            rules: fieldRules(institutionCreateSchema.shape.name),
        },
        {
            type: "text",
            name: "urlSuffix",
            model: urlSuffix,
            label: i18n.global.t("institutions.fields.urlSuffix.label"),
            required: isRequired(institutionCreateSchema.shape.urlSuffix),
            rules: [
                ...fieldRules(institutionCreateSchema.shape.urlSuffix),
                urlSuffixRule,
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
