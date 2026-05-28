<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <UserAccountForm
            v-if="user"
            ref="formRef"
            :title="$t('titles.editUserAccount')"
            mode="edit"
            :initial-user="user"
            data-test-prefix="editUserAccount"
            :change-password-loading="changePasswordLoading"
            @edit-submit="handleSubmit"
            @cancel="router.push({ name: '/(app)/user-account/' })"
            @change-password="handleChangePassword"
        />
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserAccountForm, {
    type ChangePasswordPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { notify } from "@/services/notifications/notify.ts";
import { useUserAccount } from "@/pages/(app)/user-account/api/useUserAccount.ts";
import { useEditUserAccount } from "@/pages/(app)/user-account/api/useEditUserAccount.ts";
import { useChangePassword } from "@/pages/(app)/user-account/api/useChangePassword.ts";
import type { UserAccount } from "@/models/userAccount.ts";

definePage({
    meta: {
        titleKey: "titles.editUserAccount",
        pageTestId: "edit-user-account-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/user-account/[userUuid]/");
const router = useRouter();
const authStore = useAuthenticatedUserAccountStore();

const formRef = ref<InstanceType<typeof UserAccountForm>>();
const userUuid = computed(() => {
    const value = route.params.userUuid;
    return typeof value === "string" ? value : undefined;
});
const {
    data: user,
    loading,
    errorMessage: fetchError,
} = useUserAccount(userUuid);

const { save, error: saveError } = useEditUserAccount();
const {
    changePassword,
    error: changePasswordError,
    loading: changePasswordLoading,
} = useChangePassword();

const errors = computed(() => (fetchError.value ? [fetchError.value] : []));

const handleSubmit = async (payload: UserAccount) => {
    if (!user.value) return;

    try {
        await save(payload);
        await router.push({ name: "/(app)/user-account/" });
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
        if (user.value.uuid === authStore.userAccount?.uuid) {
            await useLogout().logout();
        }
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
