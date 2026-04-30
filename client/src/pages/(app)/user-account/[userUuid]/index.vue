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
import { translate } from "@/utils/generalUtils.ts";
import UserAccountEditForm from "@/pages/(app)/user-account/components/UserAccountEditForm.vue";

definePage({
    meta: {
        titleKey: "titles.editUserAccountx",
        pageTestId: "edit-user-account-page",
        isPageBlue: true,
    },
});

const route = useRoute();
const userId = route.params.userUuid;
</script>
