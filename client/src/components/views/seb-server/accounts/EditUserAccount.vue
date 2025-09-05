<script setup lang="ts">
    import UserAccountEditForm from '@/components/views/seb-server/accounts/UserAccountEditForm.vue';
    import { useRoute } from 'vue-router';
    import {translate} from "@/utils/generalUtils";

    const route = useRoute();
    const userId : string = route.params.userUuid as string;

    console.log(userId)
</script>

<template>
    <UserAccountEditForm
        :userUuid="userId"
        :title="translate('titles.editUserAccount')"
        data-testid="editUserAccount-form-parentComponent"
    />
</template>
