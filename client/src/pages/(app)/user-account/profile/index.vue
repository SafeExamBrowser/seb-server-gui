<template>
    <LoadingFallbackComponent :loading="loading" :errors="error ? [error] : []">
        <UserAccountForm
            v-if="user"
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

definePage({
    meta: {
        titleKey: "titles.profileSettings",
        pageTestId: "profile-settings-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const { user, loading, error, refetch: refetchCurrentUser } = useCurrentUser();

const { mutateData: save, data: saved } = useMutation(editUserAccount);
const {
    mutateData: changeUserPassword,
    data: changedPassword,
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
    }
};
</script>
