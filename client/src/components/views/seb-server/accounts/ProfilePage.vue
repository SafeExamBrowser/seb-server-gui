<!-- pages/Profile.vue -->
<script setup lang="ts">
    import {  useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
    import UserAccountEditForm from '@/components/views/seb-server/accounts/UserAccountEditForm.vue';
    import { translate } from '@/utils/generalUtils';
    import {Store} from "pinia";

    const authStore = useAuthenticatedUserAccountStore();
    const userId :string = authStore.userAccount?.uuid || "";
</script>

<template>
    <UserAccountEditForm
        :userUuid="userId"
        :title="translate('titles.profileSettings')"
    />
</template>
