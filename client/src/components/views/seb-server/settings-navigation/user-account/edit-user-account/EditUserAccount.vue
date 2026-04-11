<template>
    <UserAccountEditForm
        data-testid="editUserAccount-form-parentComponent"
        :title="translate('titles.editUserAccount')"
        :user-uuid="userId"
        :is-profile="false"
    />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { translate } from "@/utils/generalUtils";
import UserAccountEditForm from "@/components/views/seb-server/settings-navigation/user-account/edit-user-account/UserAccountEditForm.vue";

const route = useRoute();
const userId: string = route.params.userUuid as string;
</script>
