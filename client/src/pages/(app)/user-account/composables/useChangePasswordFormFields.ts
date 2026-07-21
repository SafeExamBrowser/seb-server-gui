import { computed, ref } from "vue";

import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import i18n from "@/i18n";
import { userAccountPasswordChangeSchema } from "@/models/userAccount.ts";

const t = (key: string) => i18n.global.t(`userAccount.changePassword.${key}`);

export const useChangePasswordFormFields = () => {
    const adminPassword = ref<string | undefined>(undefined);
    const newPassword = ref<string | undefined>(undefined);
    const confirmNewPassword = ref<string | undefined>(undefined);

    const { isRequired, fieldRules } = useZodFormRules();
    const confirmNewPasswordRule = (value: string | undefined) =>
        value === newPassword.value ||
        i18n.global.t("validation.passwordsMatch");

    const formFields = computed<FormField[]>(() => [
        {
            type: "password" as const,
            name: "adminPassword",
            model: adminPassword,
            label: t("fields.adminPassword.label"),
            required: isRequired(
                userAccountPasswordChangeSchema.shape.password,
            ),
            rules: fieldRules(userAccountPasswordChangeSchema.shape.password),
        },
        {
            type: "password" as const,
            name: "newPassword",
            model: newPassword,
            label: t("fields.newPassword.label"),
            required: isRequired(
                userAccountPasswordChangeSchema.shape.newPassword,
            ),
            rules: fieldRules(
                userAccountPasswordChangeSchema.shape.newPassword,
            ),
        },
        {
            type: "password" as const,
            name: "confirmNewPassword",
            model: confirmNewPassword,
            label: t("fields.confirmNewPassword.label"),
            required: isRequired(
                userAccountPasswordChangeSchema.shape.confirmNewPassword,
            ),
            rules: [
                ...fieldRules(
                    userAccountPasswordChangeSchema.shape.confirmNewPassword,
                ),
                confirmNewPasswordRule,
            ],
            validationDependsOn: ["newPassword"],
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
