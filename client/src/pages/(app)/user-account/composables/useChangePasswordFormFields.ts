import { computed, ref } from "vue";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

const t = (key: string) => i18n.global.t(`userAccount.changePassword.${key}`);

export const useChangePasswordFormFields = () => {
    const adminPassword = ref<string | undefined>(undefined);
    const newPassword = ref<string | undefined>(undefined);
    const confirmNewPassword = ref<string | undefined>(undefined);

    const rules = useRules();

    const formFields = computed<FormField[]>(() => [
        {
            type: "password" as const,
            name: "adminPassword",
            model: adminPassword,
            label: t("fields.adminPassword.label"),
            required: true,
            rules: [rules.required()],
        },
        {
            type: "password" as const,
            name: "newPassword",
            model: newPassword,
            label: t("fields.newPassword.label"),
            required: true,
            rules: [rules.required(), rules.minLength(8)],
        },
        {
            type: "password" as const,
            name: "confirmNewPassword",
            model: confirmNewPassword,
            label: t("fields.confirmNewPassword.label"),
            required: true,
            validationDependsOn: ["newPassword"],
            rules: [
                (v: string | undefined) =>
                    v === newPassword.value ||
                    i18n.global.t(
                        "userAccount.general.validation.passwordsDontMatch",
                    ),
            ],
        },
    ]);

    const reset = () => {
        adminPassword.value = undefined;
        newPassword.value = undefined;
        confirmNewPassword.value = undefined;
    };

    return {
        formFields,
        adminPassword,
        newPassword,
        confirmNewPassword,
        reset,
    };
};
