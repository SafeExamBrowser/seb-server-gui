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
            @submit="handleSubmit"
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
    type UserAccountFormPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";
import {
    changePassword,
    editUserAccount,
} from "@/services/seb-server/userAccountService.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { notify } from "@/services/notifications/notify.ts";

definePage({
    meta: {
        titleKey: "titles.profileSettings",
        pageTestId: "profile-settings-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof UserAccountForm>>();
const { user, loading, error, refetch: refetchCurrentUser } = useCurrentUser();

const {
    mutateData: save,
    data: saved,
    error: saveError,
} = useMutation(editUserAccount);
const {
    mutateData: changeUserPassword,
    data: changedPassword,
    error: changePasswordError,
    loading: changePasswordLoading,
} = useMutation(
    (payload: {
        uuid: string;
        adminPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) =>
        changePassword(
            payload.uuid,
            payload.adminPassword,
            payload.newPassword,
            payload.confirmNewPassword,
        ),
);

const handleSubmit = async (payload: UserAccountFormPayload) => {
    if (!user.value) return;
    await save({
        uuid: user.value.uuid,
        institutionId: Number(payload.institutionId),
        creationDate: user.value.creationDate,
        name: payload.name,
        surname: payload.surname,
        username: payload.username,
        email: payload.email,
        active: user.value.active,
        language: "en",
        timezone: payload.timezone,
        userRoles: payload.userRoles,
    });
    if (saved.value) {
        await refetchCurrentUser();
        await router.push({ name: "/(app)/" });
        return;
    }
    if (saveError.value) {
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
    await changeUserPassword({
        uuid: user.value.uuid,
        adminPassword: payload.adminPassword,
        newPassword: payload.newPassword,
        confirmNewPassword: payload.confirmNewPassword,
    });
    if (changedPassword.value) {
        await useLogout().logout();
        return;
    }
    if (changePasswordError.value) {
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
