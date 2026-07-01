<template>
    <LoadingFallbackComponent :loading="loading" :errors="error ? [error] : []">
        <UserAccountForm
            v-if="user"
            ref="formRef"
            :title="$t('titles.profileSettings')"
            mode="profile"
            :initial-user="user"
            :data-test-prefix="userAccountFormConfig.profileTestPrefix"
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
import UserAccountForm from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { userAccountFormConfig } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { useUserAccountFormSubmit } from "@/pages/(app)/user-account/composables/useUserAccountFormSubmit.ts";

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

const { handleSubmit, handleChangePassword, changePasswordLoading } =
    useUserAccountFormSubmit({
        account: user,
        applyEditErrors: (err) => formRef.value?.applyBackendErrors(err),
        applyPasswordErrors: (err) =>
            formRef.value?.applyChangePasswordBackendErrors(err),
        onSaved: () => router.push({ name: "/(app)/" }),
        onPasswordChanged: () => useLogout().logout(),
    });
</script>
