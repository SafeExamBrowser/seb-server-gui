<template>
    <UserAccountEditForm
        data-testid="profile-form-parentComponent"
        :title="translate('titles.profileSettings')"
        :user-uuid="userId"
        :is-profile="true"
    />
</template>

<!-- pages/Profile.vue -->
<script setup lang="ts">
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import UserAccountEditForm from "@/pages/(app)/user-account/components/UserAccountEditForm.vue";

definePage({
    meta: {
        titleKey: "titles.profile",
        pageTestId: "profile-settings-page",
        isPageBlue: true,
    },
});

const authStore = useAuthenticatedUserAccountStore();
const userId: string = authStore.userAccount?.uuid || "";
</script>
