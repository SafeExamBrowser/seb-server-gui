<!-- pages/Profile.vue -->
<script setup lang="ts">
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
import UserAccountEditForm from "@/components/views/seb-server/accounts/UserAccountEditForm.vue";
import { translate } from "@/utils/generalUtils";

const authStore = useAuthenticatedUserAccountStore();
const userId: string = authStore.userAccount?.uuid || "";
</script>

<template>
    <UserAccountEditForm
        data-testid="profile-form-parentComponent"
        :title="translate('titles.profileSettings')"
        :user-uuid="userId"
    />
</template>
