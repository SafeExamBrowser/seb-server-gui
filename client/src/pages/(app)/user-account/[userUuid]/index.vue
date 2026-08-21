<template>
    <NotFoundPage
        v-if="notFound"
        :message="$t('userAccount.notFound.message')"
        :back-link="notFoundBackLink"
    />
    <LoadingFallbackComponent
        v-else
        :loading="loading"
        :errors="fetchError ? [fetchError] : []"
    >
        <UserAccountForm
            v-if="user && !isTeacherAccount"
            ref="formRef"
            :title="$t('titles.editUserAccount')"
            mode="edit"
            :initial-user="user"
            :data-test-prefix="userAccountFormConfig.editTestPrefix"
            :change-password-loading="changePasswordLoading"
            @edit-submit="handleSubmit"
            @cancel="router.push({ name: '/(app)/user-account/' })"
            @change-password="handleChangePassword"
        />
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useLogout } from "@/composables/useLogout.ts";
import { isTeacherOnlyAccount } from "@/models/userAccount.ts";
import { useUserAccountQuery } from "@/pages/(app)/user-account/api/useUserAccountQuery.ts";
import UserAccountForm from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { useUserAccountFormSubmit } from "@/pages/(app)/user-account/composables/useUserAccountFormSubmit.ts";
import { userAccountFormConfig } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import { typedTo } from "@/router/typedTo";
import {
    isNotFoundError,
    toAppErrorOrUndefined,
} from "@/services/errors/toAppError.ts";
import { notify } from "@/services/notifications/notify.ts";

definePage({
    meta: {
        titleKey: "titles.editUserAccount",
        pageTestId: "edit-user-account-page",
        isPageBlue: true,
        requiredComponent: "EDIT_USER_ACCOUNT",
    },
});

const route = useRoute("/(app)/user-account/[userUuid]/");
const router = useRouter();
const { t } = useI18n();

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

const notFound = computed(() => isNotFoundError(fetchError.value));

const notFoundBackLink = {
    label: t("userAccount.notFound.backToList"),
    to: typedTo({ name: "/(app)/user-account/" }),
};

// Teacher accounts are auto-generated and cannot be edited. If someone reaches
// this page directly (e.g. by URL) for one, warn them and send them home.
const isTeacherAccount = computed(() =>
    isTeacherOnlyAccount(user.value?.userRoles),
);

watch(
    isTeacherAccount,
    (isTeacher) => {
        if (!isTeacher) return;
        notify.warning(
            t("userAccount.teacherNotEditable.title"),
            t("userAccount.teacherNotEditable.message"),
        );
        void router.replace({ name: "/(app)/" });
    },
    { immediate: true },
);

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
