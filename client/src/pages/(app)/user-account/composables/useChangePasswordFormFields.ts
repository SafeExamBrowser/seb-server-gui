import { computed, ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import {
    zPasswordChange,
    zUserMod,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

const t = (key: string) => i18n.global.t(`userAccount.changePassword.${key}`);

export const useChangePasswordFormFields = () => {
    const adminPassword = ref<string | undefined>(undefined);
    const newPassword = ref<string | undefined>(undefined);
    const confirmNewPassword = ref<string | undefined>(undefined);

    const { isRequired, lengthRules } = useZodFormRules();

    const formFields = computed<FormField[]>(() => [
        {
            type: "password" as const,
            name: "adminPassword",
            model: adminPassword,
            label: t("fields.adminPassword.label"),
            required: isRequired(zPasswordChange.shape.password),
            rules: lengthRules(zPasswordChange.shape.password),
        },
        {
            type: "password" as const,
            name: "newPassword",
            model: newPassword,
            label: t("fields.newPassword.label"),
            required: isRequired(zUserMod.shape.newPassword),
            rules: lengthRules(zUserMod.shape.newPassword),
        },
        {
            type: "password" as const,
            name: "confirmNewPassword",
            model: confirmNewPassword,
            label: t("fields.confirmNewPassword.label"),
            required: isRequired(zUserMod.shape.confirmNewPassword),
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
