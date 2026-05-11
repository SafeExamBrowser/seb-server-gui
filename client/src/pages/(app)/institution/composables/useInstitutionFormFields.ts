import { computed, ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

const URL_SUFFIX_PATTERN = /^$|^.{3,45}$/;
const LOGO_ACCEPT_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg"];

export const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result);
            const comma = result.indexOf(",");
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

export const useInstitutionFormFields = () => {
    const name = ref<string | undefined>(undefined);
    const urlSuffix = ref<string | undefined>(undefined);
    const logoImage = ref<(File | string)[]>([]);

    const t = (key: string) =>
        i18n.global.t(`institutions.institutionFormFields.${key}`);

    const rules = useRules();

    const formFields = computed<FormField[]>(() => [
        {
            type: "image",
            name: "logoImage",
            model: logoImage,
            label: t("labels.logoImage"),
            dropTitle: i18n.global.t("general.formFields.image.dropTitle"),
            hint: i18n.global.t("general.formFields.image.hint", {
                types: LOGO_ACCEPT_EXTENSIONS.join(", "),
            }),
            acceptExtensions: LOGO_ACCEPT_EXTENSIONS,
            maxFiles: 2,
        },
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
    ]);

    return {
        formFields,
        name,
        urlSuffix,
        logoImage,
    };
};
