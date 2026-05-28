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
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserAccountForm, {
    type ChangePasswordPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { notify } from "@/services/notifications/notify.ts";
import { useEditUserAccount } from "@/pages/(app)/user-account/api/useEditUserAccount.ts";
import { useChangePassword } from "@/pages/(app)/user-account/api/useChangePassword.ts";
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
const { user, loading, error } = useCurrentUser();

const { save, error: saveError } = useEditUserAccount();
const {
    changePassword,
    error: changePasswordError,
    loading: changePasswordLoading,
} = useChangePassword();

const handleSubmit = async (payload: UserAccount) => {
    if (!user.value) return;
    try {
        await save(payload);
        await router.push({ name: "/(app)/" });
    } catch {
        const result = formRef.value?.applyBackendErrors(saveError.value);
        if (!result?.fullyHandled) {
            notify.serverError(result?.appError ?? saveError.value, {
                contextLabel: "useraccount",
                onlyMessages: result?.unhandledMessages,
            });
        }
    }
};

const handleChangePassword = async (payload: ChangePasswordPayload) => {
    if (!user.value) return;
    try {
        await changePassword({
            uuid: user.value.uuid,
            password: payload.adminPassword,
            newPassword: payload.newPassword,
            confirmNewPassword: payload.confirmNewPassword,
        });
        await useLogout().logout();
    } catch {
        const result = formRef.value?.applyChangePasswordBackendErrors(
            changePasswordError.value,
        );
        if (!result?.fullyHandled) {
            notify.serverError(result?.appError ?? changePasswordError.value, {
                contextLabel: "useraccount.password",
                onlyMessages: result?.unhandledMessages,
            });
        }
    }
};
</script>
