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
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { useUserAccountQuery } from "@/pages/(app)/user-account/api/useUserAccountQuery.ts";
import { useEditUserAccountMutation } from "@/pages/(app)/user-account/api/useEditUserAccountMutation.ts";
import { useChangePasswordMutation } from "@/pages/(app)/user-account/api/useChangePasswordMutation.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
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
    error: userError,
} = useUserAccountQuery(userUuid);
const fetchError = computed(() => toAppErrorOrUndefined(userError.value));

const { data: authenticatedUser } = useCurrentUserQuery();
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
    if (currentUser.uuid === authenticatedUser.value?.uuid) {
        await useLogout().logout();
    }
};
</script>
