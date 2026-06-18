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
import UserAccountForm from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { useUserAccountQuery } from "@/pages/(app)/user-account/api/useUserAccountQuery.ts";
import { useUserAccountFormSubmit } from "@/pages/(app)/user-account/composables/useUserAccountFormSubmit.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

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
    error: userError,
} = useUserAccountQuery(userUuid);
const fetchError = computed(() => toAppErrorOrUndefined(userError.value));

const { data: authenticatedUser } = useCurrentUserQuery();

const { handleSubmit, handleChangePassword, changePasswordLoading } =
    useUserAccountFormSubmit({
        account: user,
        applyEditErrors: (err) => formRef.value?.applyBackendErrors(err),
        applyPasswordErrors: (err) =>
            formRef.value?.applyChangePasswordBackendErrors(err),
        onSaved: () => router.push({ name: "/(app)/user-account/" }),
        onPasswordChanged: (account) => {
            if (account.uuid === authenticatedUser.value?.uuid) {
                return useLogout().logout();
            }
        },
    });
</script>
