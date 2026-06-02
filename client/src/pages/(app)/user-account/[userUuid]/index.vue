<template>
    <LoadingFallbackComponent
        :loading="loading"
        :errors="fetchError ? [fetchError] : []"
    >
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
import { getCurrentUser } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { useUserAccount } from "@/pages/(app)/user-account/api/useUserAccount.ts";
import { useEditUserAccount } from "@/pages/(app)/user-account/api/useEditUserAccount.ts";
import { useChangePassword } from "@/pages/(app)/user-account/api/useChangePassword.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
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

const formRef = ref<InstanceType<typeof UserAccountForm>>();
const userUuid = computed(() => {
    const value = route.params.userUuid;
    return typeof value === "string" ? value : undefined;
});
const {
    data: user,
    isPending: loading,
    error: fetchError,
} = useUserAccount(userUuid);

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
    await router.push({ name: "/(app)/user-account/" });
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
    if (currentUser.uuid === getCurrentUser()?.uuid) {
        await useLogout().logout();
    }
};
</script>
