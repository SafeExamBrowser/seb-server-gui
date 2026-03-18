<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="CREATE_USER_ACCOUNTS_ROUTE"
            />
        </template>

        <template #PanelMain>
            <h1>Content</h1>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import { CREATE_USER_ACCOUNTS_ROUTE } from "@/utils/constants.ts";
</script>
