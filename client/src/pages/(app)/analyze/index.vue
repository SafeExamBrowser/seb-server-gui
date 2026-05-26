<template>
    <BasicPage
        :title="$t('titles.analyze')"
        :bread-crumb="[{ label: $t('titles.analyze') }]"
        :data-test-id="dataTestId"
    >
        <template #PanelTop> TODO Search </template>
        <template #PanelMain> TODO finished/archived exams </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";

const dataTestId = "analyze";
</script>
