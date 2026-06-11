<template>
    <LoadingFallbackComponent :loading="loading" :errors="error ? [error] : []">
        <UserAccountForm
            v-if="user"
            ref="formRef"
            :title="$t('titles.profileSettings')"
            mode="profile"
            :initial-user="user"
            data-test-prefix="profile"
            :change-password-loading="changePasswordLoading"
            @edit-submit="handleSubmit"
            @cancel="router.push({ name: '/(app)/' })"
            @change-password="handleChangePassword"
        />
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import UserAccountForm, {
    type ChangePasswordPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { useEditUserAccount } from "@/pages/(app)/user-account/api/useEditUserAccount.ts";
import { useChangePassword } from "@/pages/(app)/user-account/api/useChangePassword.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import type { UserAccount } from "@/models/userAccount.ts";

definePage({
    meta: {
        titleKey: "titles.profileSettings",
        pageTestId: "profile-settings-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof UserAccountForm>>();
const {
    data: user,
    isPending: loading,
    error: userError,
} = useCurrentUserQuery();
const error = computed(() => toAppErrorOrUndefined(userError.value));

const { save, error: saveError } = useEditUserAccount();
const {
    changePassword,
    error: changePasswordError,
    isPending: changePasswordLoading,
} = useChangePassword();

const handleSubmit = async (payload: UserAccount) => {
    if (!user.value) return;

    const saved = await submitWithFormErrors({
        run: () => save(payload),
        applyErrors: (err) => formRef.value?.applyBackendErrors(err),
        error: saveError,
        contextLabel: "useraccount",
    });
    if (!saved) return;
    await router.push({ name: "/(app)/" });
};

const handleChangePassword = async (payload: ChangePasswordPayload) => {
    const currentUser = user.value;
    if (!currentUser) return;

    const changed = await submitWithFormErrors({
        run: () =>
            changePassword({
                uuid: currentUser.uuid,
                password: payload.adminPassword,
                newPassword: payload.newPassword,
                confirmNewPassword: payload.confirmNewPassword,
            }),
        applyErrors: (err) =>
            formRef.value?.applyChangePasswordBackendErrors(err),
        error: changePasswordError,
        contextLabel: "useraccount.password",
    });
    if (!changed) return;
    await useLogout().logout();
};
</script>
