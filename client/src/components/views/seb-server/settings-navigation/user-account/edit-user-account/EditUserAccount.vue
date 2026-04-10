<template>
    <UserAccountEditForm
        data-testid="editUserAccount-form-parentComponent"
        :title="translate('titles.editUserAccount')"
        :user-uuid="userId"
        :is-profile="false"
    />
</template>

<script setup lang="ts">
import UserAccountEditForm from "@/components/views/seb-server/accounts/UserAccountEditForm.vue";
import { useRoute } from "vue-router";
import { translate } from "@/utils/generalUtils";

const route = useRoute();
const userId: string = route.params.userUuid as string;
</script>
