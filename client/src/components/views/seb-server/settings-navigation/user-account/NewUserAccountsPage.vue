<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #PanelMain>
            <h1>this goes in panel 1</h1>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
</script>
