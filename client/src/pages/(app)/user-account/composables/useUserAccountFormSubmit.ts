import { computed, type Ref } from "vue";
import { useEditUserAccountMutation } from "@/pages/(app)/user-account/api/useEditUserAccountMutation.ts";
import { useChangePasswordMutation } from "@/pages/(app)/user-account/api/useChangePasswordMutation.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { ApplyBackendErrorsResult } from "@/services/errors/formErrorMapping.ts";
import type { UserAccount } from "@/models/userAccount.ts";
import type { ChangePasswordPayload } from "@/pages/(app)/user-account/components/UserAccountForm.vue";

type ApplyErrors = (error: unknown) => ApplyBackendErrorsResult | undefined;

export const useUserAccountFormSubmit = (config: {
    account: Readonly<Ref<UserAccount | undefined>>;
    applyEditErrors: ApplyErrors;
    applyPasswordErrors: ApplyErrors;
    onSaved: () => unknown;
    onPasswordChanged: (account: UserAccount) => unknown;
}) => {
    const { mutateAsync: save, error: saveMutationError } =
        useEditUserAccountMutation();
    const saveError = computed(() =>
        toAppErrorOrUndefined(saveMutationError.value),
    );

    const {
        mutateAsync: changePassword,
        error: changePasswordMutationError,
        isPending: changePasswordLoading,
    } = useChangePasswordMutation();
    const changePasswordError = computed(() =>
        toAppErrorOrUndefined(changePasswordMutationError.value),
    );

    const handleSubmit = async (payload: UserAccount) => {
        if (!config.account.value) {
            return;
        }
        const saved = await submitWithFormErrors({
            run: () => save(payload),
            applyErrors: config.applyEditErrors,
            error: saveError,
            contextLabel: "useraccount",
        });
        if (!saved) {
            return;
        }
        await config.onSaved();
    };

    const handleChangePassword = async (payload: ChangePasswordPayload) => {
        const account = config.account.value;
        if (!account) {
            return;
        }
        const changed = await submitWithFormErrors({
            run: () =>
                changePassword({
                    uuid: account.uuid,
                    password: payload.adminPassword,
                    newPassword: payload.newPassword,
                    confirmNewPassword: payload.confirmNewPassword,
                }),
            applyErrors: config.applyPasswordErrors,
            error: changePasswordError,
            contextLabel: "useraccount.password",
        });
        if (!changed) {
            return;
        }
        await config.onPasswordChanged(account);
    };

    return { handleSubmit, handleChangePassword, changePasswordLoading };
};
