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
            @submit="handleSubmit"
            @cancel="router.push({ name: '/(app)/user-account/' })"
            @change-password="handleChangePassword"
        />
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserAccountForm, {
    type ChangePasswordPayload,
    type UserAccountFormPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useMutation } from "@/composables/useMutation.ts";
import {
    changePassword,
    editUserAccount,
    getUserAccountById,
} from "@/services/seb-server/userAccountService.ts";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
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
const { refetch: refetchCurrentUser } = useCurrentUser();

const formRef = ref<InstanceType<typeof UserAccountForm>>();
const user = ref<UserAccount>();
const fetchLoading = ref(false);
const fetchError = ref<string>();

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

const loading = computed(() => fetchLoading.value);
const errors = computed(() =>
    [fetchError.value].filter((e) => e !== undefined),
);

onMounted(async () => {
    fetchLoading.value = true;
    try {
        user.value = await getUserAccountById(String(route.params.userUuid));
    } catch (err) {
        fetchError.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
        fetchLoading.value = false;
    }
});

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
        if (user.value.uuid === authStore.userAccount?.uuid) {
            await refetchCurrentUser();
        }
        await router.push({ name: "/(app)/user-account/" });
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
    if (
        changedPassword.value &&
        user.value.uuid === authStore.userAccount?.uuid
    ) {
        await useLogout().logout();
    }
};
</script>
